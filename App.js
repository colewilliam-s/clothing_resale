import { StatusBar } from 'expo-status-bar';
import { styles } from './src/login_page/styles'
import { Text, View, TextInput } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>CatamountSales</Text>
      <TextInput style={styles.textInput}></TextInput>
      <TextInput style={styles.textInput}></TextInput>
      <StatusBar style="dark" />
    </View>
  );
}