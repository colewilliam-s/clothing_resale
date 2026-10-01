import { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../src/passwordReset/passwordResetStyles';
import { supabase } from '../src/supabase';

export default function passwordReset() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    async function handleReset() {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
    
        if (error) {
            alert(error.message);
            return;
        }
        alert('If that email exists, you will receive a reset link');
        return;
    }
    
    return (
        <ScrollView
            style = { styles.container }
        >
            <Text style = { styles.text }>Enter your email and we'll send you a reset link</Text>
            <TextInput
                placeHolder = 'Email'
                value = { email }
                onChangeText = { setEmail }
                keyboardType = 'email-address'
                autoCapitalize = 'none'
            />
            <Pressable>
                <Text>Send Reset Link</Text>
            </Pressable>

        </ScrollView>
    )
}
