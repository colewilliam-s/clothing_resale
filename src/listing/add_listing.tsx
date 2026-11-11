import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSession } from '../session/SessionProvider';
import { SafeAreaView } from 'react-native-safe-area-context'

import { type PhotoChange, createListing, updateListing } from '../profile/api';
import { type Listing } from '../types'
// i created a styles file in the same directory just to get rid of the errors. further explained in the actual file
import { styles } from '../listing/styles';

type Props = {
  existing?: Listing;
  saveLabel: string;
  onSaved: () => void;
};

//const MAX_PHOTOS = 6;

// Maybe get a larger more relatable list of categories from database and make a drop down
const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'];
const CONDITIONS = ['New with tags', 'Like new', 'Good', 'Fair','Busted','Mended', 'Upcycled'];

export function ListingForm({ existing, saveLabel, onSaved }: Props) {
  const { session } = useSession();
  const userId = session?.user.id;
  //const isEditing = !!existing; not sure if needed yet

  const [photoUri, setPhotoUri] = useState<string | null>(existing?.image_url ?? null);     //db uses image_url
  const [photoChange, setPhotoChange] = useState<PhotoChange>({ kind: 'keep' });
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [price, setPrice] = useState(existing?.price != null ? String(existing.price) : '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [size, setSize] = useState(existing?.size ?? '');
  const [condition, setCondition] = useState(existing?.condition ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [color, setColor] = useState(existing?.color ?? '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setPhotoUri(asset.uri);
    setPhotoChange({ kind: 'new', uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' });
  }

  function removePhoto() {
    setPhotoUri(null);
    setPhotoChange({ kind: 'remove' });
  }
  
  async function handleSave() {
    setError('');
    const priceNumber = Number(price);

    if (!photoUri) return setError('Please add a photo.');
    if (!title.trim()) return setError('Please enter a title.');
    if (!price || isNaN(priceNumber) || priceNumber <= 0) return setError('Please enter a valid price.');
    if (!category) return setError('Please choose a category.');
    if (!size.trim()) return setError('Please enter a size.');
    if (!condition) return setError('Please choose a condition.');
    if (!userId) return;

    const fields = {
      title, description, price: priceNumber, category, size, condition, brand, color,
    };

    // this logic doesn't work right now because createListing() and updateListing() don't have any code inside of them rn
    setSaving(true);
    try {
      if (existing) {
        await updateListing(existing.id, fields, photoChange, existing.image_url ?? null);
      } else {
        await createListing(userId, fields, photoChange);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your listing.');
    } finally {
      setSaving(false);
    }
  }


  return (
    <SafeAreaView
            style={{ flex: 1, backgroundColor: '#fff' }} 
            edges={['top']}
      >
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
      >
        {/* PHOTO */}
        <Text style={styles.label}>Photo</Text>
        <View style={styles.photoPicker}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: 160, height: 200, borderRadius: 8 }} />
          ) : null}
          <View style={styles.photoActions}>
            <Pressable onPress={pickPhoto} hitSlop={8}>
              <Text style={styles.photoAction}>{photoUri ? 'Change photo' : 'Add photo'}</Text>
            </Pressable>
            {photoUri ? (
              <Pressable onPress={removePhoto} hitSlop={8}>
                <Text style={styles.photoAction}>Remove</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} maxLength={80} />

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={500}
        />

        {/* PRICE */}
        <Text style={styles.label}>Price ($)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType='decimal-pad' />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Pressable key={c} onPress={() => setCategory(c)}>
              <Text style={category === c ? styles.chipSelected : styles.chip}>{c}</Text>
            </Pressable>
          ))}
        </View>

        {/* SIZE */}
        <Text style={styles.label}>Size</Text>
        <TextInput style={styles.input} value={size} onChangeText={setSize} maxLength={20} />

        {/* CONDITION */}
        <Text style={styles.label}>Condition</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CONDITIONS.map((c) => (
            <Pressable key={c} onPress={() => setCondition(c)}>
              <Text style={condition === c ? styles.chipSelected : styles.chip}>{c}</Text>
            </Pressable>
          ))}
        </View>

        {/* BRAND, COLOR */}
        <Text style={styles.label}>Brand (optional)</Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} maxLength={40} />
        <Text style={styles.label}>Color (optional)</Text>
        <TextInput style={styles.input} value={color} onChangeText={setColor} maxLength={30} />

        {/* TODO: add new questions here */}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.primaryButton, styles.saveButton, pressed && styles.pressed]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : saveLabel}</Text>
        </Pressable>
      </ScrollView>    
    </SafeAreaView>
  );
}