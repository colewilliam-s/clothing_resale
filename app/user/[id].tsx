// Another user's profile, reached from a username or the "more" tile on the home page

import { Stack, useLocalSearchParams } from 'expo-router';
import { useSession } from '../../src/session/SessionProvider';
import { ProfileView } from '../../src/profile/ProfileView';

export default function UserProfile() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { session } = useSession();

  return (
    <>
      {/* the root Stack hides headers, so turn one on here to get a back button */}
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'Back' }} />
      <ProfileView userId={id} isOwn={id === session?.user.id} />
    </>
  );
}
