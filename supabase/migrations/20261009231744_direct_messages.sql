create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz default now(),
  last_message_at timestamptz default now()
);

create table public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz default now()
);

create index on public.messages (conversation_id, created_at desc);
create index on public.conversation_participants (user_id);

-- Helper used by the policies. Security definer avoids a recursion error
-- that happens when a policy on a table queries that same table.
create function public.is_participant(conv uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = conv and user_id = auth.uid()
  );
$$;

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

create policy "Participants can view conversations"
  on public.conversations for select to authenticated
  using (public.is_participant(id));

create policy "Participants can view participants"
  on public.conversation_participants for select to authenticated
  using (public.is_participant(conversation_id));

create policy "Participants can read messages"
  on public.messages for select to authenticated
  using (public.is_participant(conversation_id));

create policy "Participants can send messages as themselves"
  on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_participant(conversation_id));

-- Keep the inbox sorted by latest activity
create function public.touch_conversation()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.conversations set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_created
  after insert on public.messages
  for each row execute function public.touch_conversation();

-- Start (or reuse) a chat with another user about a listing
create function public.get_or_create_conversation(other uuid, listing uuid default null)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  conv uuid;
begin
  if other = auth.uid() then
    raise exception 'You cannot message yourself';
  end if;

  select c.id into conv
  from public.conversations c
  join public.conversation_participants a
    on a.conversation_id = c.id and a.user_id = auth.uid()
  join public.conversation_participants b
    on b.conversation_id = c.id and b.user_id = other
  where c.listing_id is not distinct from listing
  limit 1;

  if conv is null then
    insert into public.conversations (listing_id) values (listing) returning id into conv;
    insert into public.conversation_participants (conversation_id, user_id)
    values (conv, auth.uid()), (conv, other);
  end if;

  return conv;
end;
$$;

-- Turn on realtime for new messages
alter publication supabase_realtime add table public.messages;