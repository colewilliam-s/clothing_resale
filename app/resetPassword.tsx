import { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../src/styling/resetPassStyles';
import { supabase } from '../src/supabase';
import * as Linking from 'expo-linking';

export default function passwordReset() {
  // variables
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(''); //trying to get an email check going inside of the resetpassword file
  const router = useRouter();

  async function handleReset() {
    // checking the emails and making, and if false, set them to nothing so it resets the text box. also setting the emails to lowercase for the if statement
    if (email.trim().toLowerCase !== confirmEmail.trim().toLowerCase()) {
      setEmail(''); // set email to blank
      setConfirmEmail(''); // set the confirmEmail to blank
      alert("Emails do not match. Please re-enter and try again");
      return;
    }

    const redirectTo = Linking.createURL('update-password');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo }); // using supabase/resend to send a confirmation email over to the user
    // even if the emails match, the link only gets sent if the email actually exists inside of the database
    if (error) {
      alert(error.message);
      return;
    }
    alert('A link to reset your password is on its way.');
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
