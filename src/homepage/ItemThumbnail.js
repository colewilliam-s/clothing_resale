// One square listing photo, plus the "more" tile that ends a row

import { Pressable, Image, View, Text, StyleSheet } from 'react-native';
import { styles } from './styles';

export function ItemThumbnail({ listing, size, onPress }) {
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

export function MoreTile({ size, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, styles.moreTile, { width: size, height: size }]}>
      <Text style={styles.moreText}>...</Text>
    </Pressable>
  );
}
