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
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js is ready');

        const loadedModel = await tf.loadLayersModel(modelURI, {
          onProgress: progress => {
            if (isMounted) {
              console.log('Loading progress:', progress);
              setLoadingProgress(progress);
            }
          },
        });

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
  }, []); // Empty dependency array

  const preprocessImage = async imageUri => {
    try {
      // Read the image file
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to Uint8Array
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const rawImageData = new Uint8Array(imgBuffer);

      // Decode and preprocess
      const imageTensor = decodeJpeg(rawImageData);
      const grayscaleImage = imageTensor.mean(2).expandDims(-1); // Convert to grayscale
      const resized = tf.image.resizeBilinear(grayscaleImage, [128, 128]);
      const normalized = resized.div(255.0);
      return normalized.expandDims(0);
    } catch (error) {
      console.error('Error preprocessing image:', error);
      throw error;
    }
  };

  const predictSign = async imageUri => {
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
      //   data.map((item, index) => {
      //     console.log('Index:', String.fromCharCode(65 + index), 'Item:', item);
      //   });
      const predictedClass = prediction.argMax(-1);
      const confidence = prediction.max().dataSync()[0];

      console.log('Prediction complete');
      console.log('Predicted class:', predictedClass.dataSync()[0]);
      console.log('Confidence:', confidence);

      setApiResponse(
        `Predicted Class: ${predictedClass.dataSync()[0]} (Confidence: ${(
          confidence * 100
        ).toFixed(2)}%)`,
      );

      // Cleanup
      processedImage.dispose();
      prediction.dispose();
      predictedClass.dispose();
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
          <Text style={styles.statusText}>
            Loading model... {(loadingProgress * 100).toFixed(0)}%
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
