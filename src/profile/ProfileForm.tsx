// The profile form. Used for first-time setup (app/setup-profile.tsx)
// and for editing later (app/edit-profile.tsx).

import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSession } from '../session/SessionProvider';
import { fetchMyNames, saveProfile, type PhotoChange } from './api';
import { Avatar } from './Avatar';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  title?: string; // shown at the top during setup; edit mode uses the screen header instead
  saveLabel: string;
  onSaved: () => void;
};

const thisYear = new Date().getFullYear();

export function ProfileForm({ title, saveLabel, onSaved }: Props) {
  const { session, profile, refreshProfile } = useSession();
  const userId = session?.user.id;

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showFullName, setShowFullName] = useState(false);
  const [classYear, setClassYear] = useState(profile?.class_year ? String(profile.class_year) : '');
  const [major, setMajor] = useState(profile?.major ?? '');
  const [photoUri, setPhotoUri] = useState<string | null>(profile?.avatar_url ?? null);
  const [photoChange, setPhotoChange] = useState<PhotoChange>({ kind: 'keep' });

  const [loadingNames, setLoadingNames] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Names live in their own table, so load them separately
  useEffect(() => {
    if (!userId) return;
    fetchMyNames(userId)
      .then((names) => {
        if (!names) return;
        setFirstName(names.first_name ?? '');
        setLastName(names.last_name ?? '');
        setShowFullName(names.show_full_name);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingNames(false));
  }, [userId]);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
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
    const year = Number(classYear);

    if (!displayName.trim()) return setError('Please enter a display name.');
    if (!firstName.trim()) return setError('Please enter your first name.');
    if (!classYear.trim()) return setError('Please set the year you are graduating');
    if (!/^\d{4}$/.test(classYear) || year < thisYear - 8 || year > thisYear + 8) {
      return setError('Please enter your class year, like 2028.');
    }
    if (!userId) return;

    setSaving(true);
    try {
      await saveProfile(
        userId,
        { displayName, firstName, lastName, showFullName, classYear: year, major },
        photoChange,
        profile?.avatar_url ?? null,
      );
      await refreshProfile();
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loadingNames) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#fff' }} 
        edges={['top']}
      >
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
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
        {title ? <Text style={styles.formTitle}>{title}</Text> : null}

        <View style={styles.photoPicker}>
          <Avatar uri={photoUri} size={96} />
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

        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          maxLength={40}
          autoCapitalize='words'
        />

        <Text style={styles.label}>Class year</Text>
        <TextInput
          style={styles.input}
          value={classYear}
          onChangeText={setClassYear}
          placeholder={String(thisYear + 2)}
          keyboardType='number-pad'
          maxLength={4}
        />

        <Text style={styles.label}>Major (optional)</Text>
        <TextInput
          style={styles.input}
          value={major}
          onChangeText={setMajor}
          maxLength={60}
          autoCapitalize='words'
        />

        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          maxLength={40}
          autoCapitalize='words'
        />

        <Text style={styles.label}>Last name (optional)</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          maxLength={40}
          autoCapitalize='words'
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Show my full name on my profile</Text>
          <Switch value={showFullName} onValueChange={setShowFullName} />
        </View>
        <Text style={styles.hint}>If this is off, only you can see your first and last name.</Text>

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
