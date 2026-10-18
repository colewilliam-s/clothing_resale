// // please PLEASE catch the south park reference
// export function verify(email, password) {
//     let emailCheck = "email123@gmail.com";
//     let passCheck = "password123";
//     if (emailCheck == email && passCheck == password){
//         alert("Donde esta mi fimilia? Bien gracias, y tu?")
//     } else {
//         alert("Email and/or password is incorrect. Please try again");
//     }
// }

import { supabase } from '../supabase';
import { Alert } from 'react-native';

export async function verify(email: string, password: string): Promise<boolean>{
    const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password });
    if(error) {
        Alert.alert('Login Error', error.message);
        return false;
    }
    return true;
}