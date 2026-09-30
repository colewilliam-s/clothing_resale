import { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { styles } from './src/login_page/styles';
import { Text, View, TextInput, ScrollView, Pressable } from 'react-native';
import { verify } from './src/login_page/verification';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView 
      style={styles.container}
      keyboardDismissMode='on-drag'
      keyboardShouldPersistTaps='handled'
    >
      <Text style={styles.header}>CatamountResale</Text>
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
        onPress={() => {
          verify(email, password)
        }}
      >
        <Text style={styles.buttonText}>press me</Text>
      </Pressable>
      <StatusBar style="dark" />
    </ScrollView>
  );
}