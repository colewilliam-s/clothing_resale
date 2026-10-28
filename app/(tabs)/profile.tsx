import { useSession } from '../../src/session/SessionProvider';
import { ProfileView } from '../../src/profile/ProfileView';

//Profile tab: shows the logged in user's own profile using the shared ProfileView
export default function Profile() {
  const { session } = useSession();

  // briefly empty while logging out, before app/_layout.tsx moves to the login screen
  if (!session) return null;

  return <ProfileView userId={session.user.id} isOwn />;
}
