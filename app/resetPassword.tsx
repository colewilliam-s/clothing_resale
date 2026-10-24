import { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../src/styling/resetPassStyles';
import { supabase } from '../src/supabase';
import * as Linking from 'expo-linking';

export default function passwordReset() {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(''); //trying to get an email check going inside of the resetpassword file
  const router = useRouter();

  async function handleReset() {
    if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      setEmail('');
      setConfirmEmail('');
      alert("Emails do not match");
      return;
    }
    const redirectTo = Linking.createURL('update-password');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      alert(error.message);
      return;
    }
    alert('If that email exists, a reset link is on its way.');
    router.back();
  }

  return (
    <>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.div}>
          <Text style={styles.text}>Enter your email and we'll send a reset link.</Text>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <TextInput
            placeholder='Confirm Email'
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <Pressable onPress={handleReset}>
            <Text>Send reset link</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}