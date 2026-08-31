import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import CustomMarker from '../../components/CustomMarker';
import { useZones } from '../../context/ZoneProvider';

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function Home() {
  const router = useRouter();
  const { zones } = useZones();
  const mapRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        setInitialRegion(DEFAULT_REGION);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleLongPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    router.push({
      pathname: '/zone/[id]',
      params: { id: 'new', latitude, longitude },
    });
  };

  if (!initialRegion) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Getting your location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        onLongPress={handleLongPress}
      >
        {zones.map((zone) => (
          <React.Fragment key={zone.id}>
            <CustomMarker
              coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
              title={zone.name}
            />
            <Circle
              center={{ latitude: zone.latitude, longitude: zone.longitude }}
              radius={zone.radius}
              strokeColor={zone.enabled ? 'rgba(255,156,1,0.8)' : 'rgba(150,150,150,0.5)'}
              fillColor={zone.enabled ? 'rgba(255,156,1,0.2)' : 'rgba(150,150,150,0.1)'}
            />
          </React.Fragment>
        ))}
      </MapView>
      {errorMsg && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{errorMsg}</Text>
        </View>
      )}
      <View style={styles.hint}>
        <Text style={styles.hintText}>Long-press the map to add a silent zone</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
  },
  banner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: '#161622',
    padding: 10,
    borderRadius: 12,
  },
  bannerText: {
    color: '#fff',
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(22,22,34,0.85)',
    padding: 10,
    borderRadius: 12,
  },
  hintText: {
    color: '#fff',
    textAlign: 'center',
  },
});
