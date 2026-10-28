// First-time profile setup. app/_layout.tsx sends new users here until their profile is finished.

import { Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../src/supabase';
import { ProfileForm } from '../src/profile/ProfileForm';
import { styles } from '../src/profile/styles';

export default function SetupProfile() {
  return (
    // this screen has no header, so keep it clear of the notch and home bar
    <SafeAreaView style={styles.container}>
      {/* After saving, app/_layout.tsx sees the finished profile and moves on to the feed */}
      <ProfileForm title='Create your profile' saveLabel='Continue' onSaved={() => {}} />

      {/* a way out in case the wrong account is logged in */}
      <Pressable onPress={() => supabase.auth.signOut()} hitSlop={8} style={styles.setupLogout}>
        <Text style={styles.setupLogoutText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
