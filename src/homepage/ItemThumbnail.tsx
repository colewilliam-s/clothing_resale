// One square listing photo, plus the "more" tile that ends a row

import { Pressable, Image, View, Text, StyleSheet } from 'react-native';
import { styles } from './styles';
import type { Listing } from '../types';

type ThumbnailProps = {
  listing: Pick<Listing, 'image_url' | 'status'>;
  size: number;
  onPress: () => void;
};

export function ItemThumbnail({ listing, size, onPress }: ThumbnailProps) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, { width: size, height: size }]}>
      {listing.image_url ? (
        <Image source={{ uri: listing.image_url }} style={StyleSheet.absoluteFill} />
      ) : null}
      {listing.status === 'sold' ? (
        <View style={styles.soldOverlay}>
          <Text style={styles.soldText}>SOLD</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

// handling if there is too many tiles
export function MoreTile({ size, onPress }: { size: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, styles.moreTile, { width: size, height: size }]}>
      <Text style={styles.moreText}>...</Text>
    </Pressable>
  );
}