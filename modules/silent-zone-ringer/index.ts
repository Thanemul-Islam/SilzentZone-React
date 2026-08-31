import { requireNativeModule } from 'expo-modules-core';

type SilentZoneRingerModuleType = {
  isDndAccessGranted(): boolean;
  requestDndAccess(): void;
  setSilentMode(silent: boolean, totalSilence: boolean): boolean;
  getCurrentInterruptionFilter(): number;
};

const SilentZoneRingerModule = requireNativeModule<SilentZoneRingerModuleType>('SilentZoneRinger');

export function isDndAccessGranted(): boolean {
  return SilentZoneRingerModule.isDndAccessGranted();
}

export function requestDndAccess(): void {
  SilentZoneRingerModule.requestDndAccess();
}

/**
 * @param silent whether to silence (true) or restore normal ringer (false)
 * @param totalSilence when silencing: true = block everything including alarms
 *   (INTERRUPTION_FILTER_NONE), false = allow alarms/priority through (INTERRUPTION_FILTER_PRIORITY).
 *   Ignored when silent=false. No-op returning false on iOS (no public API for this).
 */
export function setSilentMode(silent: boolean, totalSilence: boolean = false): boolean {
  return SilentZoneRingerModule.setSilentMode(silent, totalSilence);
}

export function getCurrentInterruptionFilter(): number {
  return SilentZoneRingerModule.getCurrentInterruptionFilter();
}
