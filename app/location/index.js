import React, {useEffect, useState} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import Button from '../../components/button';
import {database} from '../../components/firebase.mjs';
import {ref, child, get} from 'firebase/database';
// import Ionicons from '@expo/vector-icons/Ionicons';

export default function Location({navigation}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [circelLatitude, setCircleLatitude] = useState(0);
  const [circelLongitude, setCircleLongitude] = useState(0);
  const [circelRadius, setCircleRadius] = useState(0);

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, '/'))
      .then(snapshot => {
        if (snapshot.exists()) {
          setLatitude(snapshot.val().location.latitude);
          setLongitude(snapshot.val().location.longitude);
          setCircleLatitude(snapshot.val().boundary.latitude);
          setCircleLongitude(snapshot.val().boundary.longitude);
          setCircleRadius(snapshot.val().boundary.radius);
        } else {
          console.log('No data available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  return (
    <View style={styles.container}>
      <Button
        text="Back "
        onPress={() => navigation.navigate('Intersection')}
        Ion={'arrow-back-outline'}
        style={{
          position: 'sticky',
          top: 10,
          left: 10,
          backgroundColor: 'rgba(255,255,255,0.7)',
          paddingHorizontal: 20,
          zIndex: 100,
        }}
      />
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
          }} // Example center
          radius={circelRadius} // Example radius in meters
          strokeWidth={2}
          strokeColor="#3399ff"
          fillColor="rgba(255, 0, 0, 0.5)"
        />
        <Marker
          coordinate={{latitude: latitude, longitude: longitude}}
          title={'Client'}>
          {/* <Ionicons name="accessibility" size={40} /> */}
        </Marker>
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          text="Change Boundary "
          onPress={() => navigation.navigate('Intersection')}
          Ion={'locate-outline'}
          style={{
            position: 'absolute',
            bottom: 10,
            backgroundColor: 'rgba(255,255,255,0.7)', // Temporary background color for visibility
            width: '100%', // Ensure the button stretches to fill the container
          }}
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
    // position: "absolute",
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
  buttonText: {
    color: 'black',
  },
});
