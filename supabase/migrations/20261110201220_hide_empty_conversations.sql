-- conversations stay hidden until a message exists
alter table public.conversations
  add column created_by uuid references public.profiles(id) on delete set null;
alter table public.conversations
  alter column last_message_at drop default;
update public.conversations c
set last_message_at = (
  select max(m.created_at) from public.messages m where m.conversation_id = c.id
);
-- ...then the create function public.can_view_conversation(...) and everything after it


-- a conversation that is visible to a participant once it has a message
-- or if that participant is the one who opened it
create function public.can_view_conversation(conv uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
    select exists (
        select 1
        from public.conversation_participants p
        join public.conversations c on c.id = p.conversation_id
        where p.conversation_id = conv
            and p.user_id = auth.uid()
            and (c.last_message_at is not null or c.created_by = auth.uid())
    );
$$;
drop policy "Participants can view conversations" on public.conversations;
drop policy "Participants can view participants" on public.conversation_participants;
drop policy "Participants can send messages as themselves" on public.messages;
create policy "Participants can view started conversations"
  on public.conversations for select to authenticated
  using (public.can_view_conversation(id));
create policy "Participants can view participants of started conversations"
  on public.conversation_participants for select to authenticated
  using (public.can_view_conversation(conversation_id));
create policy "Participants can send messages as themselves"
  on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.can_view_conversation(conversation_id));
-- record who opened the chat, and let someone reuse an empty chat the other person opened
create or replace function public.get_or_create_conversation(other uuid, listing uuid default null)
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
    insert into public.conversations (listing_id, created_by)
    values (listing, auth.uid()) returning id into conv;
    insert into public.conversation_participants (conversation_id, user_id)
    values (conv, auth.uid()), (conv, other);
  else
    update public.conversations set created_by = auth.uid()
    where id = conv and last_message_at is null;
  end if;

  return conv;
end;
$$;
