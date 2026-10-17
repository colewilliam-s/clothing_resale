import { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../src/styling/resetPassStyles';
import { supabase } from '../src/supabase';

export default function passwordReset() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  async function handleReset() {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      alert(error.message);
      return;
    }
    alert('If that email exists, a reset link is on its way.');
    router.back();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Enter your email and we'll send a reset link.</Text>
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <Pressable onPress={handleReset}>
        <Text>Send reset link</Text>
      </Pressable>
    </ScrollView>
  );
}