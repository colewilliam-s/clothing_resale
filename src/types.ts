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