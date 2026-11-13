import { StyleSheet } from 'react-native';

// Placeholder: greys until the visual identity is decided.
// Fonts are DM Sans, loaded in app/_layout.tsx

export const GRID_COLUMNS = 3;
export const GRID_GAP = 4; // placeholder: space between grid tiles
export const SIDE_PADDING = 16;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: 'DMSans_400Regular',
  },

  // Avatar: blank grey circle when there's no photo
  avatar: {
    backgroundColor: '#e5e5e5',
  },

  // Profile header
  header: {
    alignItems: 'center', // placeholder: centered layout
    paddingTop: 24,
    paddingBottom: 20,
    gap: 4,
  },
  displayName: {
    fontSize: 15,
    color: '#111',
    fontFamily: 'DMSans_700Bold',
  },
  fullName: {
    fontSize: 22,
    color: '#111',
    fontFamily: 'DMSans_500Medium',
    fontWeight: 800,
    marginTop: 12
  },
  detail: {
    fontSize: 14,
    color: '#6b6b6b',
    fontFamily: 'DMSans_400Regular',
  },

  // Listings grid
  gridContent: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 32,
    flexGrow: 1,
    borderWidth: 4,
    borderColor: '#000'
  },
  gridRow: {
    gap: GRID_GAP,
  },
  gridItem: {
    marginBottom: GRID_GAP,
    borderWidth: 4,
    borderColor: '#000',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 12,
  },
  emptyText: {
    color: '#6b6b6b',
    fontFamily: 'DMSans_400Regular',
  },

  // Buttons. Placeholder colors.
  primaryButton: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'DMSans_500Medium',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#111',
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
  },
  linkText: {
    color: '#6b6b6b',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 24,
    fontFamily: 'DMSans_400Regular',
  },
  pressed: {
    opacity: 0.7,
  },

  // Profile form
  formContent: {
    padding: 20,
    paddingBottom: 48,
  },
  formTitle: {
    fontSize: 24,
    color: '#111',
    marginBottom: 20,
    marginTop: 24,
    fontFamily: 'DMSans_700Bold',
  },
  photoPicker: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 20,
  },
  photoAction: {
    color: '#111',
    textDecorationLine: 'underline',
    fontFamily: 'DMSans_500Medium',
  },
  label: {
    fontSize: 13,
    color: '#444',
    marginTop: 16,
    marginBottom: 6,
    fontFamily: 'DMSans_500Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    fontFamily: 'DMSans_400Regular',
  },
  hint: {
    fontSize: 12,
    color: '#9a9a9a',
    marginTop: 4,
    fontFamily: 'DMSans_400Regular',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    marginRight: 12,
    fontFamily: 'DMSans_400Regular',
  },
  saveButton: {
    marginTop: 28,
  },
  setupLogout: {
    paddingVertical: 12,
  },
  setupLogoutText: {
    color: '#6b6b6b',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'DMSans_400Regular',
  },
  messageIcon: {
    margin: 5
  },
  chatButton: {
    backgroundColor: '#9e9b9b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  chip: {
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#d0d0d0',
  backgroundColor: '#fff',
  color: '#333',
  fontSize: 14,
  overflow: 'hidden', // needed on iOS for borderRadius to apply to Text
},
chipSelected: {
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#111',
  backgroundColor: '#111',
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  overflow: 'hidden',
}
});
