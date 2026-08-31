import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function setupAndroidNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('zone-alerts', {
    name: 'Zone alerts',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF9C01',
  });
}

export async function sendZoneEntryNotification(zoneName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Entering a Silent Zone',
      body: `You're near "${zoneName}". Please silence your phone.`,
    },
    trigger: null,
  });
}
