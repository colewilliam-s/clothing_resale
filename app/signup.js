import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('form'); // 'form' or 'verify'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('.edu')) {
      setMessage('Please use your .edu email.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: cleanEmail, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setEmail(cleanEmail);
    setMessage(`We sent a code to ${cleanEmail}.`);
    setStep('verify');
  }

  async function handleVerify() {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email',
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    // Verifying also signs the user in. Sign out so we can test the login flow separately.
    await supabase.auth.signOut();
    alert('Email verified! You can log in now.');
    router.replace('/');
  }

  async function handleResend() {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setMessage(error ? error.message : 'New code sent.');
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      {step === 'form' ? (
        <>
          <TextInput
            placeholder='School email (.edu)'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable onPress={handleSignUp} disabled={loading}>
            <Text>{loading ? 'Creating account...' : 'Sign up'}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            placeholder='6-digit code'
            value={code}
            onChangeText={setCode}
            keyboardType='number-pad'
          />
          <Pressable onPress={handleVerify} disabled={loading}>
            <Text>{loading ? 'Verifying...' : 'Verify'}</Text>
          </Pressable>
          <Pressable onPress={handleResend}>
            <Text>Resend code</Text>
          </Pressable>
        </>
      )}
      {message ? <Text>{message}</Text> : null}
    </View>
  );
}