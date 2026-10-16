// One user's row in the feed: their name, then a fixed (non-scrolling) row of tiles.
// 5 or fewer listings: show them all. More than 5: show 4 plus "more".

import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { label } from '../label';
import { ROW_SLOTS } from './feed';
import { ItemThumbnail, MoreTile } from './ItemThumbnail';

const SIDE_PADDING = 16; // matches paddingHorizontal in styles.content
const TILE_GAP = 8; // matches gap in styles.tiles

export function UserRow({ profile }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Square tiles sized so 5 slots exactly fill the screen width
  const tileSize = (width - SIDE_PADDING * 2 - TILE_GAP * (ROW_SLOTS - 1)) / ROW_SLOTS;

  const listings = profile.listings;
  const hasMore = listings.length > ROW_SLOTS;
  const visible = hasMore ? listings.slice(0, ROW_SLOTS - 1) : listings;

  const openProfile = () => router.push(`/user/${profile.id}`);

  return (
    <View style={styles.row}>
      <Pressable onPress={openProfile} hitSlop={8} style={styles.nameWrap}>
        <Text style={styles.name}>{label(profile)}</Text>
      </Pressable>
      <View style={styles.tiles}>
        {visible.map((listing) => (
          <ItemThumbnail
            key={listing.id}
            listing={listing}
            size={tileSize}
            onPress={() => router.push(`/item/${listing.id}`)}
          />
        ))}
        {hasMore ? <MoreTile size={tileSize} onPress={openProfile} /> : null}
      </View>
    </View>
  );
}
