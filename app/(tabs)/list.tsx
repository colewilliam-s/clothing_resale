import { View } from 'react-native';
import { ListingForm } from '../../src/listing/add_listing';

export default function List() {
  return (
    <View style={{ flex: 1 }}>
      <ListingForm
        saveLabel="Create Listing"
        onSaved={() => {
          console.log('Listing successfully created!');
        }}
      />
    </View>
  );
}