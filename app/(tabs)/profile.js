import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/supabase';

// Placeholder: the Profile tab isn't designed yet.
// Log Out moved here from the old home page. It now actually signs out of Supabase,
// instead of only going back to the login screen while the session stays alive.

export default function Profile() {
  const router = useRouter();

  async function logOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text>Profile: coming soon</Text>
      <Pressable onPress={logOut}>
        <Text style={{ textDecorationLine: 'underline' }}>Log Out</Text>
      </Pressable>
    </View>
  );
}
