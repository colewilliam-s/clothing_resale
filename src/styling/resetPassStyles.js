import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Controls the layout *inside* the ScrollView
  contentContainer: {
    flexGrow: 1,            // lets content fill the screen so it can be centered vertically
    justifyContent: 'center', // vertical centering
    alignItems: 'center',     // horizontal centering
    padding: 20,
  },
  div: {
    width: '100%',
    alignItems: 'center',   // centers input and button horizontally.
  },
  text: {
    textAlign: 'center',    // centers the text itself when it wraps to multiple lines
    marginBottom: 16,
  },
  input: {
    width: '100%',
    textAlign: 'center',    // optional: centers the typed text / placeholders
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