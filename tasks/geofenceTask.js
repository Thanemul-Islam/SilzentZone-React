import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SilentZoneRinger from '../modules/silent-zone-ringer';
import { sendZoneEntryNotification } from '../lib/notifications';
import { getSilentModeType, SILENT_MODE_TYPES } from '../lib/settingsStorage';
import { ZONES_STORAGE_KEY } from '../context/zoneStorage';

export const GEOFENCE_TASK_NAME = 'silentzone-geofence-task';

async function getEnabledZones() {
  const raw = await AsyncStorage.getItem(ZONES_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw).filter((z) => z.enabled);
  } catch {
    return [];
  }
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function handleGeofenceEvent({ eventType, region }) {
  const zones = await getEnabledZones();
  const zone = zones.find((z) => z.id === region.identifier);

  if (eventType === Location.GeofencingEventType.Enter) {
    const modeType = await getSilentModeType();
    SilentZoneRinger.setSilentMode(true, modeType === SILENT_MODE_TYPES.TOTAL);
    if (Platform.OS === 'ios') {
      await sendZoneEntryNotification(zone?.name ?? 'a Silent Zone');
    }
  } else if (eventType === Location.GeofencingEventType.Exit) {
    if (Platform.OS === 'android') {
      const current = await Location.getLastKnownPositionAsync();
      const stillInsideAnother =
        current &&
        zones.some(
          (z) =>
            z.id !== region.identifier &&
            distanceMeters(
              current.coords.latitude,
              current.coords.longitude,
              z.latitude,
              z.longitude
            ) <= z.radius
        );
      if (!stillInsideAnother) {
        SilentZoneRinger.setSilentMode(false, false);
      }
    }
  }
}

TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.warn('[geofenceTask]', error.message);
    return;
  }
  await handleGeofenceEvent(data);
});
