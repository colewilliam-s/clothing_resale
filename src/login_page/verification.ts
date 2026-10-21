// imports
import { supabase } from '../supabase';
import { Alert } from 'react-native';

// exporting the function for other files for verification (duh)

// boolean type so other files know if it's just true or false. no need for other logic outside of this that we can handle
export async function verify(email: string, password: string): Promise<boolean>{
    const { data, error } = await supabase.auth.signInWithPassword({ 
	// making the email fully lowercase for verification, regardless of how the user types it. password stays exactly the same because capital letters MATTER
        email: email.trim().toLowerCase(), 
        password });
    // returning an error if the verification fails, while providing the message and what went wrong for the user
    if(error) {
        Alert.alert('Login Error', error.message);
        return false;
    }
    // verification succeeded
    return true;
}
