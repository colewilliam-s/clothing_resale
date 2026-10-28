// A round profile photo. Shows a blank grey circle when there's no photo.

import { Image, View } from 'react-native';
import { styles } from './styles';

export function Avatar({ uri, size }: { uri: string | null; size: number }) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (!uri) return <View style={[styles.avatar, shape]} />;
  return <Image source={{ uri }} style={[styles.avatar, shape]} />;
}
