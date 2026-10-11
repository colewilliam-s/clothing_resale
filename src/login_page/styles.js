// Styling file for the login page

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    fontSize: 40,
    textDecorationColor: '#000',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: '35%',
    fontFamily: 'sans-serif-light',
    fontFamily: 'Verdana'
  },
  login: {
    marginTop: '15%'
  },
  emailInput: {
    borderBlockColor: '#000',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 6,
    width: '65%',
    height: '17%',
    textAlign: 'left',
    paddingLeft: '10',
    fontSize: 20
  },
  passwordInput: {
    borderBlockColor: '#000',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 6,
    width: '65%',
    marginTop: '12.5%',
    height: '17%',
    textAlign: 'left',
    paddingLeft: '10',
    fontSize: 20
  },
  button: {
    backgroundColor: '#1f8a0c',
    paddingVertical: 13,
    borderRadius: 8,
    width: '45%',
    alignSelf: 'center',
    margin: '3'
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },
  passReset: {
    color: '#0037dd',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: '6%',
    fontSize: 20
  },
  homePageContainer: {
    
  },
  homePageText: {
    paddingTop: '10%'
  }
});