// Styling file for the home page

import { StyleSheet } from 'react-native';

// Placeholder: greys until the colorscheme is decided
// Fonts are DM Sans, loaded in app/_layout.js

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  empty: {
    color: '#6b6b6b',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'DMSans_400Regular',
  },

  // One user's row
  row: {
    marginBottom: 20,
  },
  nameWrap: {
    alignSelf: 'flex-start', // only the name itself is tappable, not the full width
    marginBottom: 8,
  },
  name: {
    fontSize: 15,
    color: '#111',
    fontFamily: 'DMSans_500Medium',
  },
  tiles: {
    flexDirection: 'row',
    gap: 8, // if you change this, change TILE_GAP in UserRow.js too
  },

  // Thumbnails
  tile: {
    backgroundColor: '#efefef',
    borderRadius: 6, // placeholder: slight rounding
    overflow: 'hidden',
  },
  soldOverlay: {
    // placeholder: dim the whole photo and center "SOLD"
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'DMSans_700Bold',
  },
  moreTile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  moreText: {
    color: '#6b6b6b',
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
  },
});
