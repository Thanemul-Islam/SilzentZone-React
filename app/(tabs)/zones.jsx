import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useZones } from '../../context/ZoneProvider';

function ZoneRow({ zone, onToggle, onEdit, onDelete }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.rowMain} onPress={onEdit}>
        <Text style={styles.name}>{zone.name}</Text>
        <Text style={styles.radius}>{Math.round(zone.radius)}m radius</Text>
      </TouchableOpacity>
      <Switch value={zone.enabled} onValueChange={onToggle} />
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Zones() {
  const router = useRouter();
  const { zones, toggleZone, removeZone } = useZones();

  const confirmDelete = (zone) => {
    Alert.alert('Delete zone', `Remove "${zone.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeZone(zone.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      {zones.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No zones yet.</Text>
          <Text style={styles.emptySubtext}>Long-press the map on the Map tab to add one.</Text>
        </View>
      ) : (
        <FlatList
          data={zones}
          keyExtractor={(z) => z.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ZoneRow
              zone={item}
              onToggle={() => toggleZone(item.id)}
              onEdit={() => router.push({ pathname: '/zone/[id]', params: { id: item.id } })}
              onDelete={() => confirmDelete(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  rowMain: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  radius: {
    color: '#CDCDE0',
    fontSize: 13,
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  deleteText: {
    color: '#FF9C01',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#CDCDE0',
    marginTop: 8,
    textAlign: 'center',
  },
});
