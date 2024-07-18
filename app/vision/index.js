import {CameraView, useCameraPermissions} from 'expo-camera';
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Speech from 'expo-speech';
import {gemini} from '../../components/gemini';
import {update} from 'firebase/database';

function speakMessage(message) {
  return new Promise(resolve => {
    Speech.speak(message, {
      onDone: resolve,
    });
  });
}

export default function Vision({navigation}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState('Initializing...');
  const camRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const updateStatus = newStatus => {
    setStatus(newStatus);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    async function captureAndProcessImage() {
      if (permission?.granted) {
        try {
          updateStatus('Preparing camera...');
          await speakMessage('Preparing to capture image');

          setTimeout(async () => {
            updateStatus('Taking picture...');
            const photo = await camRef.current.takePictureAsync({base64: true});

            updateStatus('Processing image...');
            await speakMessage('Image captured. Analyzing...');
            let response;
            try {
              response = await gemini(photo.base64);
            } catch (e) {
              console.log(e);
              updateStatus('An error occurred');
              await speakMessage(
                'An error occurred while processing the image',
              );
              navigation.navigate('Intersection');
            }
            console.log(response);

            updateStatus('Analysis complete');
            await speakMessage(response);

            updateStatus('Navigating back...');
            await speakMessage('Returning to main screen');
            setTimeout(() => navigation.navigate('Intersection'), 1000);
          }, 2000);
        } catch (error) {
          console.error('Error:', error);
          updateStatus('An error occurred');
          await speakMessage('An error occurred while processing the image');
        }
      }
    }

    captureAndProcessImage();
  }, [permission]);

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
        <Animated.Text style={[styles.statusText, {opacity: fadeAnim}]}>
          {status}
        </Animated.Text>
      </View>
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
});
