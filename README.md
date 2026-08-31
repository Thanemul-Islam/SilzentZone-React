# SilentZone

A cross-platform mobile app (iOS/Android) built with React Native and Expo that lets you mark real-world locations as **Silent Zones** on a map. When your phone's GPS enters one, SilentZone automatically manages your ringer — silencing calls and notifications on Android, or reminding you to silence manually on iOS.

## Why two different behaviors?

Apple doesn't expose a public API for third-party apps to silence a phone or toggle Focus/Do Not Disturb — the OS deliberately keeps that under the user's manual control. Android does allow it, through a user-granted "Do Not Disturb access" permission. SilentZone is built around that platform reality rather than pretending it doesn't exist:

| Platform | Behavior on zone entry |
|---|---|
| **Android** | Automatically silences the phone (with your choice of "Priority only" — alarms still ring — or total silence) via a small custom native module, and restores normal ringer on exit. |
| **iOS** | Fires a local notification reminding you to silence your phone, since no automatic option exists. |

## Features

- Interactive map — drop a pin anywhere by long-pressing, set a custom trigger radius, and see all your zones plotted with live location
- Local, no-backend zone management — add, edit, enable/disable, and delete zones, persisted on-device
- Background geofencing — detects zone entry/exit even while the app is closed
- Per-user silence preference (Android) — Priority-only vs. total silence
- Permission-aware Settings screen — clear status for location, notifications, and (Android) Do Not Disturb access, each with a one-tap request

## Tech stack

- **React Native** + **Expo** (SDK 54, Expo Router for file-based navigation)
- **react-native-maps** for the map and geofence visualization
- **expo-location** + **expo-task-manager** for background geofencing
- **expo-notifications** for zone-entry alerts
- **AsyncStorage** for local persistence — no backend, no accounts
- A custom local Expo native module (Kotlin) for Android ringer/Do Not Disturb control
- **NativeWind** (Tailwind for React Native) for styling

## Getting started

### Prerequisites
- Node.js and npm
- A Google Maps API key (get one from [Google Cloud Console](https://console.cloud.google.com/)) — separate keys are recommended for iOS and Android, each restricted to this app's bundle ID/package name

### Setup

```bash
npm install
cp .env.example .env
```

Then fill in `.env` with your Google Maps API key(s):

```
GOOGLE_MAPS_IOS_API_KEY=your_ios_key_here
GOOGLE_MAPS_ANDROID_API_KEY=your_android_key_here
```

### Running the app

Because SilentZone includes a custom native module, it can't run in the plain Expo Go app — it needs a development build:

```bash
npx expo run:ios       # requires Xcode 16.1+
npx expo run:android   # requires Android Studio/SDK, or build via EAS
```

## Project structure

```
app/                    Expo Router screens (file-based routing)
  (tabs)/               Map, Zones, and Settings tabs
  zone/[id].jsx          Add/edit a zone
  _layout.jsx            Root layout: fonts, splash screen, geofencing task registration
context/
  ZoneProvider.js         Zone CRUD + AsyncStorage persistence + geofencing sync
components/               Reusable UI (CustomButton, FormField, CustomMarker)
tasks/
  geofenceTask.js         Background task: handles zone enter/exit events
lib/
  notifications.js         Local notification setup and dispatch
  settingsStorage.js       Persisted user preferences (silence mode)
modules/
  silent-zone-ringer/       Custom native module: Android ringer/DND control, iOS no-op stub
```

## Current status

- ✅ Core app (map, zone management, permissions) — built and verified working
- 🚧 Background geofencing and Android auto-silence — implemented, pending on-device verification
- 📋 Planned: calendar-aware and schedule-based zone rules, zone history/analytics

## Platform notes

- **iOS region monitoring limit**: Apple caps monitored geofence regions at 20 per app.
- **Android Do Not Disturb access** has no in-app permission dialog — the app opens the relevant system settings screen for you to grant it manually.
