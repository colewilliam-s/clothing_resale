import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Controls the layout *inside* the ScrollView
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  div: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});