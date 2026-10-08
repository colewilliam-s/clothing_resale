import { View, ScrollView, Text } from 'react-native';
import { useRouter, Link, Stack } from 'expo-router';

export default function HomePage() {
    const router = useRouter();

    return (
        <>
            <ScrollView>
                <View>
                    <Text>just a test for the home page</Text>
                    <Link
                        title='Log Out'
                        href='/' // because everything will normally point to index in the app/ folder, theres no need to specify index here
                    >
                        Log Out
                    </Link>
                </View>
            </ScrollView>
        </>
    )
}