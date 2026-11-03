import { View, Text } from 'react-native';
import { ListingForm } from '../../src/listing/add_listing';

export default function List() {
  return (
    <View>
      <ListingForm
        saveLabel="Create Listing"
        onSaved={() => {
          console.log('Listing successfully created!');
        }}
      />
    </View>
  );
}