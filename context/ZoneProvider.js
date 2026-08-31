import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { ZONES_STORAGE_KEY } from './zoneStorage';
import { GEOFENCE_TASK_NAME } from '../tasks/geofenceTask';

const IOS_MAX_MONITORED_REGIONS = 20;

const ZoneContext = createContext(undefined);

export function ZoneProvider({ children }) {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ZONES_STORAGE_KEY);
        if (raw) setZones(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    (async () => {
      const enabledZones = zones.filter((z) => z.enabled);
      const { status } = await Location.getBackgroundPermissionsAsync();

      if (status !== 'granted' || enabledZones.length === 0) {
        if (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME)) {
          await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
        }
        return;
      }

      const regionSource =
        Platform.OS === 'ios' ? enabledZones.slice(0, IOS_MAX_MONITORED_REGIONS) : enabledZones;

      const regions = regionSource.map((z) => ({
        identifier: z.id,
        latitude: z.latitude,
        longitude: z.longitude,
        radius: z.radius,
        notifyOnEnter: true,
        notifyOnExit: true,
      }));

      await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
    })();
  }, [zones, loading]);

  const persist = async (next) => {
    setZones(next);
    await AsyncStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(next));
  };

  const addZone = ({ name, latitude, longitude, radius }) => {
    const zone = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      latitude,
      longitude,
      radius,
      enabled: true,
    };
    return persist([...zones, zone]);
  };

  const updateZone = (id, updates) =>
    persist(zones.map((z) => (z.id === id ? { ...z, ...updates } : z)));

  const removeZone = (id) => persist(zones.filter((z) => z.id !== id));

  const toggleZone = (id) =>
    persist(zones.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z)));

  return (
    <ZoneContext.Provider
      value={{ zones, loading, addZone, updateZone, removeZone, toggleZone }}
    >
      {children}
    </ZoneContext.Provider>
  );
}

export function useZones() {
  const ctx = useContext(ZoneContext);
  if (!ctx) throw new Error('useZones must be used within a ZoneProvider');
  return ctx;
}
