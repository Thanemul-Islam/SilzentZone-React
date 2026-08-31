import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useZones } from '../../context/ZoneProvider';

const DEFAULT_RADIUS = 150;

export default function ZoneForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { zones, addZone, updateZone } = useZones();

  const isNew = params.id === 'new';
  const existing = useMemo(
    () => (isNew ? null : zones.find((z) => z.id === params.id)),
    [isNew, params.id, zones]
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [radius, setRadius] = useState(
    String(existing?.radius ?? DEFAULT_RADIUS)
  );

  const latitude = existing?.latitude ?? Number(params.latitude);
  const longitude = existing?.longitude ?? Number(params.longitude);

  const handleSave = async () => {
    const parsedRadius = Number(radius);
    if (!name.trim() || !Number.isFinite(parsedRadius) || parsedRadius <= 0) {
      return;
    }
    if (isNew) {
      await addZone({ name: name.trim(), latitude, longitude, radius: parsedRadius });
    } else {
      await updateZone(existing.id, { name: name.trim(), radius: parsedRadius });
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isNew ? 'New Silent Zone' : 'Edit Zone'}</Text>

      <FormField
        title="Name"
        value={name}
        placeholder="e.g. Office"
        handleChangeText={setName}
        otherStyles="mt-6"
      />

      <FormField
        title="Radius (meters)"
        value={radius}
        placeholder="150"
        handleChangeText={setRadius}
        keyboardType="numeric"
        otherStyles="mt-6"
      />

      <Text style={styles.coords}>
        {latitude?.toFixed?.(5)}, {longitude?.toFixed?.(5)}
      </Text>

      <CustomButton title="Save" handlePress={handleSave} containerStyles="mt-8" />
      <CustomButton
        title="Cancel"
        handlePress={() => router.back()}
        containerStyles="mt-3 bg-black-100"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  coords: {
    color: '#CDCDE0',
    marginTop: 16,
    fontSize: 12,
  },
});
