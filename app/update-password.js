import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/supabase';
import { styles } from '../src/styling/updatePassStyles';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [ready, setReady] = useState(false);

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
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.message);
      return;
    }
    alert('Password updated!');
    router.replace('/');
  }

  if (!ready) return <Text>Verifying link...</Text>;

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
        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update password</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}