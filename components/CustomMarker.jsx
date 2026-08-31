import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Callout, Marker } from 'react-native-maps';
import { icons } from '../constants';

export default function CustomMarker({ coordinate, title, image = icons.mute }) {
  return (
    <Marker coordinate={coordinate}>
        <View style={styles.markerContainer}>
            <Image source={image} style={styles.markerImage} tintColor="#fff" />
        </View>
        <Callout tooltip>
          <View>
            <Text>{title}</Text>
          </View>
        </Callout>
      </Marker>
  )
}

const styles = StyleSheet.create({
    
    markerImage: {
      width: '100%', 
      height: '100%', 
    },
    markerContainer: {
        width: 30,
        height: 30,
        borderRadius: 50,
        // position: 'absolute',
        // top: 120,
        borderColor: '#FF0',
        borderWidth: 4,
        backgroundColor: 'blue',
        overflow: 'hidden'
    }
  });
  