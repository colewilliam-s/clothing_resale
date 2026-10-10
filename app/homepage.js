import { View, ScrollView, Text } from 'react-native';
import { useRouter, Link } from 'expo-router';

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
                    <Link
                        title='direct_messages'
                        href='/dm'
                    >
                        Direct Messages
                    </Link>
                </View>
            </ScrollView>
        </>
    )
}