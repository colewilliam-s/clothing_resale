// Editing your profile, reached from Edit Profile on the Profile tab

import { Stack, useRouter } from 'expo-router';
import { ProfileForm } from '../src/profile/ProfileForm';

export default function EditProfile() {
  const router = useRouter();

  return (
    <>
      {/* the root Stack hides headers, so turn one on here to get a back button */}
      <Stack.Screen options={{ headerShown: true, title: 'Edit Profile', headerBackTitle: 'Back' }} />
      <ProfileForm saveLabel='Save' onSaved={() => router.back()} />
    </>
  );
}
