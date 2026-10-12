import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../src/login_page/styles';
import { Text, View, TextInput, ScrollView, Pressable } from 'react-native';
import { Link, useRouter, Stack } from 'expo-router';
import { verify } from '../src/login_page/verification';
import { signInWithMicrosoft } from '../src/login_page/microsoftLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{headerBackVisible: false}}/>
      <ScrollView 
        style={styles.container}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.header}>Thrift Shift</Text>
        <View style={styles.login}>
          <TextInput 
            style={styles.emailInput}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <TextInput 
            style={styles.passwordInput}
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={async () => {
            const ok = await verify(email, password);
            if(ok) router.replace('/homepage');
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={async () => {
            const r = await signInWithMicrosoft();

            if (r.ok) {
              router.replace('/homepage');
            } else {
              setError(r.message);
            }
          }}
        >
          <Text style={styles.buttonText}>Login with UVM SSO</Text>
        </Pressable>
        <Link
          style={styles.passReset}
          title='Forgot Password?'
          href='/resetPassword'
        >
          Forgot/Reset Password?
        </Link>
        <Link
          style={styles.passReset}
          title='Forgot Password?'
          href='/signup'
        >
          Sign Up
        </Link>
        <StatusBar style="dark" />
      </ScrollView>
    </>
  );
}