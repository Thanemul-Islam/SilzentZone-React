import AsyncStorage from '@react-native-async-storage/async-storage';

const SILENT_MODE_TYPE_KEY = '@silzentzone/silentModeType';

export const SILENT_MODE_TYPES = {
  PRIORITY: 'priority',
  TOTAL: 'total',
};

export async function getSilentModeType() {
  const value = await AsyncStorage.getItem(SILENT_MODE_TYPE_KEY);
  return value === SILENT_MODE_TYPES.TOTAL ? SILENT_MODE_TYPES.TOTAL : SILENT_MODE_TYPES.PRIORITY;
}

export async function setSilentModeType(type) {
  await AsyncStorage.setItem(SILENT_MODE_TYPE_KEY, type);
}
