import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// The bottom tab bar. Fixed to the bottom edge, full width, not floating.
// Placeholder: icons and greys until those are decided.
// Icons are filled on the active tab, outlined on the others.

const icon = (active, inactive) => ({ focused, color, size }) => (
  <Ionicons name={focused ? active : inactive} size={size} color={color} />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: 'none', // same as the root Stack, for now
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#9a9a9a',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e5e5e5' },
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'DMSans_500Medium' },
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { color: '#111', fontFamily: 'DMSans_700Bold' },
        headerTitleAlign: 'center',
      }}
    >
      {/* the file is homepage.js so the route stays /homepage, which index.js already sends people to */}
      <Tabs.Screen name='homepage' options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen name='search' options={{ title: 'Search', tabBarIcon: icon('search', 'search-outline') }} />
      <Tabs.Screen name='connect' options={{ title: 'Connect', tabBarIcon: icon('chatbubbles', 'chatbubbles-outline') }} />
      <Tabs.Screen name='list' options={{ title: 'List', tabBarIcon: icon('add-circle', 'add-circle-outline') }} />
      <Tabs.Screen name='profile' options={{ title: 'Profile', tabBarIcon: icon('person', 'person-outline') }} />
    </Tabs>
  );
}
