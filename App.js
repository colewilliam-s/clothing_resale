import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>CatamountSales</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    fontSize: 48,
    textDecorationColor: '#000',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: '30%',
    fontFamily: 'sans-serif-light',
    fontFamily: 'Verdana'
  }
});
