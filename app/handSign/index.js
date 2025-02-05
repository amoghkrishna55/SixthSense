import {CameraView, useCameraPermissions} from 'expo-camera';
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../../components/button';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {modelURI} from '../../components/modelHandler';
import * as FileSystem from 'expo-file-system';
import {decodeJpeg} from '@tensorflow/tfjs-react-native';

export default function HandSign({navigation}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [apiResponse, setApiResponse] = useState(null);
  const camRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js is ready');

        const loadedModel = await tf.loadLayersModel(modelURI);

        if (isMounted) {
          console.log('Model loaded successfully');
          setModel(loadedModel);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading model:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  const preprocessImage = async imageUri => {
    try {
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const rawImageData = new Uint8Array(imgBuffer);

      const imageTensor = decodeJpeg(rawImageData);
      const grayscaleImage = imageTensor.mean(2).expandDims(-1);
      const resized = tf.image.resizeBilinear(grayscaleImage, [128, 128]);
      const normalized = resized.div(255.0);
      return normalized.expandDims(0);
    } catch (error) {
      console.error('Error preprocessing image:', error);
      throw error;
    }
  };

  const predictSign = async imageUri => {
    const predictionData = [];
    if (!model) {
      console.error('Model not loaded');
      return;
    }

    try {
      const processedImage = await preprocessImage(imageUri);
      console.log('Image preprocessed successfully');

      const prediction = await model.predict(processedImage);
      console.log('Prediction:', prediction.dataSync());
      const data = prediction.dataSync();
      console.log('Prediction Data:', predictionData);

      data.map((item, index) => {
        if (index === 0) {
          predictionData.push(['blank', item]);
        } else {
          predictionData.push([String.fromCharCode(64 + index), item]);
        }
      });

      predictionData.sort((a, b) => {
        return b[1] - a[1];
      });

      console.log('Prediction complete');
      console.log('Prediction Data:', predictionData);

      setApiResponse(
        `Predicted Class: ${predictionData[0][0]} (Confidence: ${(
          predictionData[0][1] * 100
        ).toFixed(2)}%)`,
      );

      processedImage.dispose();
      prediction.dispose();
    } catch (error) {
      console.error('Error during prediction:', error);
      setApiResponse('Error during prediction');
    }
  };

  const handleCapture = async () => {
    if (!permission?.granted || !camRef.current) {
      console.log('Camera permission not granted or camera not ready');
      return;
    }

    try {
      const photo = await camRef.current.takePictureAsync();
      console.log('Photo captured:', photo.uri);
      await predictSign(photo.uri);
    } catch (error) {
      console.error('Error capturing photo:', error);
      setApiResponse('Error capturing photo');
    }
  };

  if (!permission) {
    return <View />;
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

  if (loading) {
    return (
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.statusText}>Loading model...</Text>
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
      <Button text="Capture" onPress={handleCapture} />
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
