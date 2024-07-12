import React, {useEffect, useState} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import Button from '../../components/button';
import {database} from '../../components/firebase.js';
import {ref, onValue} from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Location({navigation}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [circelLatitude, setCircleLatitude] = useState(0);
  const [circelLongitude, setCircleLongitude] = useState(0);
  const [circelRadius, setCircleRadius] = useState(0);

  useEffect(() => {
    const dbRef = ref(database);
    let listener = onValue(dbRef, snapshot => {
      if (snapshot.exists()) {
        setLatitude(snapshot.val().location.latitude);
        setLongitude(snapshot.val().location.longitude);
        setCircleLatitude(snapshot.val().boundary.latitude);
        setCircleLongitude(snapshot.val().boundary.longitude);
        setCircleRadius(snapshot.val().boundary.radius);
      } else {
        console.log('No data available');
      }
    });

    return () => {
      try {
        if (listener) {
          listener();
          console.log('unmounting');
        }
      } catch (e) {
        console.log('error in unmounting');
      }
    };
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: circelLatitude,
          longitude: circelLongitude,
          latitudeDelta: (circelRadius / 40075000) * 360 * 3,
          longitudeDelta: (circelRadius / 40075000) * 360 * 3,
        }}>
        <Circle
          center={{
            latitude: circelLatitude,
            longitude: circelLongitude,
          }}
          radius={circelRadius}
          strokeWidth={2}
          strokeColor="#3399ff"
          fillColor="rgba(255, 0, 0, 0.5)"
        />
        <Marker
          coordinate={{latitude: latitude, longitude: longitude}}
          title={'Client'}>
          <Ionicons name="accessibility" size={30} color="black" />
        </Marker>
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          text="Change Boundary "
          onPress={() =>
            navigation.navigate('Boundary', {
              latitude: circelLatitude,
              longitude: circelLongitude,
              radius: circelRadius,
            })
          }
          Ion={'logo-tableau'}
        />
      </View>
      <View style={styles.buttonContainerTop}>
        <Button
          text="Back "
          onPress={() => navigation.navigate('Intersection')}
          Ion={'arrow-back-outline'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0, // Added to make the container full width
    zIndex: 100, // Ensure the button is on top of the map
  },
  buttonContainerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    // right: 0, // Added to make the container full width
    // zIndex: 100, // Ensure the button is on top of the map
  },
});
