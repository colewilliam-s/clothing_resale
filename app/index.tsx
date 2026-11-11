import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../src/login_page/styles';
import { Text, View, TextInput, ScrollView, Pressable } from 'react-native';
import { useSession } from '../src/session/SessionProvider';
import { Link, Stack } from 'expo-router';
import { verify } from '../src/login_page/verification';
import { signInWithMicrosoft } from '../src/login_page/microsoftLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { session } = useSession();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  if (session) return <View style={{ flex: 1, backgroundColor: '#fff'}} />

  return (
    <>
      <Stack.Screen options={{ headerBackVisible: false }} />
      <ScrollView
        style={styles.container}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.header}>ThryftShyft</Text>
        <View style={styles.login}>
          <TextInput
            style={styles.emailInput}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <Pressable
              style={styles.icon}
              onPress={toggleShowPassword}
              hitSlop={10}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
              />
            </Pressable>
          </View>
          <Text
            style={styles.caseText}
          >*Case Sensitive*</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={async () => {
            // once logged in, app/_layout.tsx sends the user to the feed or profile setup
            await verify(email, password);
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={async () => {
            const r = await signInWithMicrosoft();

            if (!r.ok) setError(r.message ?? 'Sign-in failed');
          }}
        >
          <Text style={styles.buttonText}>Login with UVM SSO</Text>
        </Pressable>
        <Link
          style={styles.passReset}
          href='/resetPassword'
        >
          Forgot/Reset Password?
        </Link>
        <Link
          style={styles.passReset}
          href='/signup'
        >
          Sign Up
        </Link>
        <StatusBar style="dark" />
      </ScrollView>
    </>
  );
}