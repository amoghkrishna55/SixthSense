import {CameraView, useCameraPermissions} from 'expo-camera';
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../../components/button';
import axios from 'axios';

export default function HandSign({navigation}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [apiResponse, setApiResponse] = useState(null);
  const camRef = useRef(null);

  const predictHandSign = async () => {
    if (permission?.granted) {
      try {
        const photo = await camRef.current.takePictureAsync({base64: true});
        const response = await axios.post(
          'https://11ab-210-89-61-6.ngrok-free.app/predict',
          {
            image_base64: photo.base64,
          },
        );
        console.log(response.data);
        setApiResponse(
          `Predicted: ${response.data.predicted_symbol}  Confidence: ${response.data.confidence}`,
        );
      } catch (error) {
        console.error('Error:', error);
        setApiResponse('Error occurred');
      } finally {
        setTimeout(() => {
          setApiResponse(null);
        }, 3000);
      }
    }
  };

  if (!permission) {
    return <View></View>;
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.statusText}>
            We need your permission to use the camera.
          </Text>
          <Text style={styles.actionText} onPress={requestPermission}>
            Grant permission
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.container}>
      <View style={styles.content}>
        <CameraView style={styles.camera} facing="back" ref={camRef} />
        <Ionicons name="camera" size={50} color="#fff" />
        {apiResponse && (
          <View style={styles.apiResponseContainer}>
            <Text style={styles.apiResponseText}>{apiResponse}</Text>
          </View>
        )}
      </View>
      <Button
        text="Click"
        onPress={() => {
          console.log('clicked');
          predictHandSign();
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  animation: {
    width: 300,
    height: 300,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 10,
  },
  apiResponseContainer: {
    position: 'absolute',
    bottom: 100,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 5,
  },
  apiResponseText: {
    color: '#fff',
    fontSize: 18,
  },
});
