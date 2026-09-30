import { StatusBar } from 'expo-status-bar';
import { styles } from '../src/passwordReset/passwordResetStyles';
import { ScrollView, Text, View } from 'react-native';

export default function passwordReset() {
    return (
        <ScrollView
            style={styles.container}
        >
            <View>
                <Text style={styles.text}>Hello World</Text>
            </View>
        </ScrollView>
    )
}