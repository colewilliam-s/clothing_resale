import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ animation: 'none', headerShown: false }} /> // for the time being of testing, the animation on this is going to be none. lowkey i want elliot to deal with the animations icl
  );
  // return (
//     <>
//       <Stack.Screen options={{ headerBackVisible: false, gestureEnabled: false}} />
//     </>
//   );
}

// return (
//     <>
//       <Stack.Screen options={{ headerBackVisible: false, gestureEnabled: false}} />
//     </>
//   );