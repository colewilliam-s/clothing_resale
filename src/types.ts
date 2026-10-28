// all the different types that may be needed for users in the present/future. file will most likely get updated as more features are added

// Profile variables
export type Profile = {
  id: string;
  display_name: string | null;
  university_domain: string | null;
};

// The rest of a profile, shown on profile pages and filled in during setup
export type ProfileDetails = Profile & {
  major: string | null;
  class_year: number | null;
  avatar_url: string | null;
};

// First and last name, kept in their own table so they can stay private
export type ProfileNames = {
  first_name: string | null;
  last_name: string | null;
  show_full_name: boolean;
};

// Listing variables
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

// Message variables
export type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

// All of the listings that pertain to a specific users profile, as well as overarching variables
export type ProfileWithListings = Profile & {
  listings: Pick<Listing, 'id' | 'title' | 'price' | 'status' | 'created_at'>[];
};

// Everything a profile page shows: details, names (null when hidden), and the listings grid
export type ProfilePageData = ProfileDetails & {
  profile_names: ProfileNames | null;
  listings: Pick<Listing, 'id' | 'image_url' | 'status' | 'created_at'>[];
};

// Giving the user information about the current listing/profile they are looking at
export type FeedProfile = Profile & {
  listings: Pick<Listing, 'id' | 'image_url' | 'status'>[];
};
