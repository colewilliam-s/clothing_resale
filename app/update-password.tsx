import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/supabase';
import { styles } from '../src/styling/updatePassStyles';

export default function UpdatePassword() {
  // variables
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ready, setReady] = useState(false);

  // supabase actions
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleUpdate() {
    if (password !== confirmPassword){
      setPassword(''); // setting the password input to blank if the passwords don't match
      setConfirmPassword(''); // setting the confirmPassword to blank if the passwords don't match
      alert("Passwords do not match!");
      return;
    }

    // updating the password inside of the database
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.message);
      return;
    }
    alert('Password updated!');
    router.replace('/');
  }

  // failsafe page
  if (!ready) {
    return (
      <>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.verifyLinkText}>Verifying link...</Text>
          <Pressable style={styles.verifyButton} onPress={() => {router.replace('/')}}>
            <Text style={styles.buttonText}>Return to homepage</Text>
          </Pressable>
        </ScrollView>
      </>
    )
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.div}>
        <TextInput
          style={styles.input}
          placeholder='New password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder='Confirm New password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update password</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
