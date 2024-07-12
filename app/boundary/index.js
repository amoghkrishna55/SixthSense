import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import {database} from '../../components/firebase';
import {ref, update} from 'firebase/database';
import Button from '../../components/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

const Boundary = ({navigation, route}) => {
  const {latitude, longitude, radius} = route.params;
  const [newlatitude, setLatitude] = useState(latitude);
  const [newlongitude, setLongitude] = useState(longitude);
  const [newradius, setRadius] = useState(radius);
  const [currLatitude, setCurrLatitude] = useState(0);
  const [currLongitude, setCurrLongitude] = useState(0);
  const [fecthing, setFecthing] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrLatitude(location.coords.latitude);
      setCurrLongitude(location.coords.longitude);
      setFecthing(false);
    };

    getLocation();
  }, []);

  const handleSubmit = () => {
    const rootRef = ref(database);
    update(rootRef, {
      boundary: {
        latitude: newlatitude,
        longitude: newlongitude,
        radius: newradius,
      },
    });
    navigation.navigate('Location');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: (radius / 40075000) * 360 * 3,
          longitudeDelta: (radius / 40075000) * 360 * 3,
        }}
        onPress={e => {
          const newCoords = e.nativeEvent.coordinate;
          setLatitude(newCoords.latitude);
          setLongitude(newCoords.longitude);
        }}>
        <Marker
          coordinate={{latitude: newlatitude, longitude: newlongitude}}
          draggable
          onDragEnd={e => {
            const newCoords = e.nativeEvent.coordinate;
            setLatitude(newCoords.latitude);
            setLongitude(newCoords.longitude);
          }}>
          <Ionicons name="location" size={50} color="black" />
        </Marker>
        <Circle
          center={{
            latitude: newlatitude,
            longitude: newlongitude,
          }}
          radius={newradius}
          strokeWidth={2}
          strokeColor="#3399ff"
          fillColor="rgba(255, 0, 0, 0.5)"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Radius (in meters) : ${radius} `}
          value={radius}
          onChangeText={e => {
            if (e != '') {
              setRadius(parseInt(e));
            } else {
              setRadius(radius);
            }
          }}
          keyboardType="numeric"
        />
        <Button
          text="Set Boundary "
          onPress={handleSubmit}
          Ion="refresh-circle-outline"
        />
      </View>
      <View style={styles.buttonContainerTop}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Button
            text="Back "
            onPress={() => navigation.navigate('Location')}
            Ion={'arrow-back-outline'}
          />
          <Button
            text={fecthing ? 'Fetching ' : 'Set Current  '}
            onPress={() => {
              if (currLatitude != 0 && currLongitude != 0) {
                setLatitude(currLatitude);
                setLongitude(currLongitude);
              }
            }}
            Ion={fecthing ? 'cloud-download-outline' : 'locate-outline'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 2,
    marginHorizontal: '10%',
    borderColor: '#292927', // A nice shade of blue for the border
    borderRadius: 10, // Rounded corners
    padding: 10,
    width: '80%', // Adjust as needed
    fontSize: 16, // Larger font size for readability
    backgroundColor: '#F0F0F0', // Soft background color
    color: '#333333', // Text color
    // Placeholder text color is platform-specific and might need to be handled differently
  },
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

export default Boundary;
