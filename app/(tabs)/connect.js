import { View, Text } from 'react-native';
import { Link } from 'expo-router';

// Placeholder: the Connect tab isn't designed yet.
// The link keeps the existing DM screen reachable now that the old home page is gone.

export default function Connect() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text>Connect: coming soon</Text>
      <Link href='/dm' style={{ textDecorationLine: 'underline' }}>
        Direct Messages
      </Link>
    </View>
  );
}
