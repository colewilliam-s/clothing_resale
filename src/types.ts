export type Profile = {
  id: string;
  display_name: string | null;
  university_domain: string | null;
};

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  size: string | null;
  condition: string | null;
  image_url: string | null;
  status: 'active' | 'sold';
  created_at: string;
  seller: Profile;
};

export type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type ProfileWithListings = Profile & {
  listings: Pick<Listing, 'id' | 'title' | 'price' | 'status' | 'created_at'>[];
};

export type FeedProfile = Profile & {
  listings: Pick<Listing, 'id' | 'image_url' | 'status'>[];
};