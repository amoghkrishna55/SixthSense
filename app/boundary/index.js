import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import {database} from '../../components/firebase';
import {ref, update} from 'firebase/database';

const Boundary = ({navigation, route}) => {
  const {latitude, longitude, radius} = route.params;
  const [newlatitude, setLatitude] = useState(latitude);
  const [newlongitude, setLongitude] = useState(longitude);
  const [newradius, setRadius] = useState(radius);

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
        }}>
        <Marker
          coordinate={{latitude: latitude, longitude: longitude}}
          draggable
          onDragEnd={e => {
            const newCoords = e.nativeEvent.coordinate;
            setLatitude(newCoords.latitude);
            setLongitude(newCoords.longitude);
          }}
        />
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
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
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
});

export default Boundary;
