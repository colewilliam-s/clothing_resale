import { useState } from 'react';
import { supabase } from '../supabase';

const data = getProfile();

interface Item { 
    name: string;
}

interface Profile {
    id: string;
    display_name: string | null; // nullable inside the schema, since the column has no "not null"
}

// function List({ items }) {
// 	return (
// 		<table>
// 			<tbody>
				
// 			</tbody>
// 		</table>
// 	)
// }

function filterItems(items: Item[], query: string): Item[] {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
   if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }
  return data;
}

export function ProfileSearchList() {
    const [query, setQuery] = useState('');

    // const filteredProfiles = filterItems(data, query);

  //   return (
	// <SearchBar query={ query } setQuery={ setQuery } />
	// <hr />
	// <List items={ filteredProfiles }>
  //   )
    
    
}

ProfileSearchList();
