import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import CustomButton from '../../components/CustomButton';
import * as SilentZoneRinger from '../../modules/silent-zone-ringer';
import { getSilentModeType, setSilentModeType, SILENT_MODE_TYPES } from '../../lib/settingsStorage';
import { useZones } from '../../context/ZoneProvider';
import { handleGeofenceEvent } from '../../tasks/geofenceTask';

export default function Settings() {
  const { zones } = useZones();
  const [foregroundStatus, setForegroundStatus] = useState(null);
  const [backgroundStatus, setBackgroundStatus] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [dndGranted, setDndGranted] = useState(null);
  const [silentModeType, setSilentModeTypeState] = useState(SILENT_MODE_TYPES.PRIORITY);

  const refreshStatus = useCallback(async () => {
    const fg = await Location.getForegroundPermissionsAsync();
    setForegroundStatus(fg.status);
    const bg = await Location.getBackgroundPermissionsAsync();
    setBackgroundStatus(bg.status);
    const notif = await Notifications.getPermissionsAsync();
    setNotificationStatus(notif.status);
    if (Platform.OS === 'android') {
      setDndGranted(SilentZoneRinger.isDndAccessGranted());
    }
    setSilentModeTypeState(await getSilentModeType());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshStatus();
    }, [refreshStatus])
  );

  const requestForeground = async () => {
    await Location.requestForegroundPermissionsAsync();
    refreshStatus();
  };

  const requestBackground = async () => {
    await Location.requestBackgroundPermissionsAsync();
    refreshStatus();
  };

  const requestNotifications = async () => {
    await Notifications.requestPermissionsAsync();
    refreshStatus();
  };

  const requestDnd = () => {
    SilentZoneRinger.requestDndAccess();
  };

  const chooseSilentModeType = async (type) => {
    await setSilentModeType(type);
    setSilentModeTypeState(type);
  };

  const fireTestZoneEvent = async () => {
    const zone = zones[0];
    await handleGeofenceEvent({
      eventType: Location.GeofencingEventType.Enter,
      region: { identifier: zone?.id ?? 'debug-zone' },
    });
    Alert.alert('Test event sent', zone ? `Simulated entering "${zone.name}".` : 'Simulated entering a zone (no saved zones yet).');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Permissions</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Location (while using app)</Text>
        <Text style={styles.status}>{foregroundStatus ?? 'checking…'}</Text>
        <CustomButton title="Request" handlePress={requestForeground} containerStyles="mt-3 min-h-[44px]" />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Location (always / background)</Text>
        <Text style={styles.status}>{backgroundStatus ?? 'checking…'}</Text>
        <Text style={styles.hint}>Must be "Always" for zones to trigger while the app is closed.</Text>
        <CustomButton title="Request" handlePress={requestBackground} containerStyles="mt-3 min-h-[44px]" />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Notifications</Text>
        <Text style={styles.status}>{notificationStatus ?? 'checking…'}</Text>
        <Text style={styles.hint}>
          {Platform.OS === 'ios'
            ? 'iOS can\'t silence your phone automatically — this notification is the reminder you\'ll get instead.'
            : 'Used for zone-entry alerts alongside the automatic silencing below.'}
        </Text>
        <CustomButton title="Request" handlePress={requestNotifications} containerStyles="mt-3 min-h-[44px]" />
      </View>

      {Platform.OS === 'android' && (
        <View style={styles.card}>
          <Text style={styles.label}>Do Not Disturb access</Text>
          <Text style={styles.status}>{dndGranted === null ? 'checking…' : dndGranted ? 'granted' : 'not granted'}</Text>
          <Text style={styles.hint}>Required for SilentZone to actually silence your phone. Opens a system settings screen — there's no in-app prompt for this one.</Text>
          <CustomButton title="Open settings" handlePress={requestDnd} containerStyles="mt-3 min-h-[44px]" />
        </View>
      )}

      {Platform.OS === 'android' && (
        <View style={styles.card}>
          <Text style={styles.label}>Silence mode</Text>
          <Text style={styles.hint}>Choose what happens when you enter a zone.</Text>
          <View style={styles.modeRow}>
            <CustomButton
              title="Priority only"
              handlePress={() => chooseSilentModeType(SILENT_MODE_TYPES.PRIORITY)}
              containerStyles={`flex-1 min-h-[44px] ${silentModeType === SILENT_MODE_TYPES.PRIORITY ? '' : 'bg-black-100'}`}
            />
            <CustomButton
              title="Total silence"
              handlePress={() => chooseSilentModeType(SILENT_MODE_TYPES.TOTAL)}
              containerStyles={`flex-1 min-h-[44px] ${silentModeType === SILENT_MODE_TYPES.TOTAL ? '' : 'bg-black-100'}`}
            />
          </View>
          <Text style={styles.hint}>
            {silentModeType === SILENT_MODE_TYPES.TOTAL
              ? 'Blocks everything, including alarms.'
              : 'Silences calls/texts/notifications, but alarms still ring.'}
          </Text>
        </View>
      )}

      {__DEV__ && (
        <View style={styles.card}>
          <Text style={styles.label}>Debug</Text>
          <Text style={styles.hint}>Simulates entering the first saved zone, without needing real GPS movement.</Text>
          <CustomButton title="Simulate zone entry" handlePress={fireTestZoneEvent} containerStyles="mt-3 min-h-[44px] bg-black-100" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    color: '#CDCDE0',
    marginTop: 4,
  },
  hint: {
    color: '#7b7b8b',
    marginTop: 6,
    lineHeight: 18,
    fontSize: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
});
