import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

const Boundary = ({onSubmit}) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');

  const handleSubmit = () => {
    // Validation or further processing can be done here
    onSubmit({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Radius (in meters)"
        value={radius}
        onChangeText={setRadius}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Boundary;
