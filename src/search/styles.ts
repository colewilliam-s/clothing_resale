import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 12
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 24,
        paddingHorizontal: 12,
        fontSize: 16,
        fontFamily: 'DMSans_400Regular',
    },
    spinner: {
        marginTop: 12
    },
    error: {
        color: 'red', marginTop: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10
    },
    pressed: {
        opacity: 0.7
    },
    rowText: {
        flex: 1
    },
    name: {
        fontSize: 15,
        color: '#111',
        fontFamily: 'DMSans_500Medium'
    },
    detail: {
        fontSize: 13,
        color: '#6b6b6b',
        fontFamily: 'DMSans_400Regular'
    },
    empty: {
        color: '#6b6b6b',
        textAlign: 'center',
        marginTop: 40,
        fontFamily: 'DMSans_400Regular'
    },
})