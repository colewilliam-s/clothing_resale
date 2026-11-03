// Another user's profile, reached from a username or the "more" tile on the home page

import { useLocalSearchParams } from 'expo-router';
import { useSession } from '../../src/session/SessionProvider';
import { ProfileView } from '../../src/profile/ProfileView';

export default function UserProfile() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { session } = useSession();

  return (
    <ProfileView
      userId={id}
      isOwn={id === session?.user.id}
    />
  );
}
