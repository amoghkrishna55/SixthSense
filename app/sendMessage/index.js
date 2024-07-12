import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet, Text, Pressable, Animated} from 'react-native';
import {Audio} from 'expo-av';
import {storage} from '../../components/firebase';
import {uploadBytesResumable, ref} from 'firebase/storage';
import {uploadedAudio} from '../../components/firebase';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';
import {useFocusEffect} from '@react-navigation/native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient';

export default function SendMessage({navigation}) {
  const [recording, setRecording] = useState();
  const [status, setStatus] = useState('Preparing');
  const animationRef = useRef(null);
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

  const uploadAudio = async uri => {
    const fileName = 'audio/' + Date.now().toString();
    const storageRef = ref(storage, fileName);
    const response = await fetch(uri);
    const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        error => {
          console.log('Error uploading file:', error);
          reject(error);
        },
        () => {
          console.log('File uploaded successfully');
          resolve(fileName);
        },
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      const playBeepAfterSpeech = async () => {
        if (animationRef.current) {
          animationRef.current.play();
        }
        updateStatus('Ready to record');
        Speech.speak('Sending Message. Speak your message after the beep', {
          onDone: () => {
            RNSystemSounds.beep(RNSystemSounds.Beeps.Negative);
            startRecording();
          },
        });
      };

      playBeepAfterSpeech();
    }, []),
  );

  async function startRecording() {
    try {
      updateStatus('Recording...');
      try {
        console.log('Checking permission..');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log('Starting recording..');
        const {recording} = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        );
        setRecording(recording);
        console.log('Recording started');
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      updateStatus('Recording failed');
    }
  }

  async function stopRecording() {
    updateStatus('Processing...');
    console.log('Stopping recording..');
    setRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    try {
      const uploadedFileName = await uploadAudio(uri);
      console.log('Audio uploaded successfully. File name:', uploadedFileName);
      uploadedAudio(uploadedFileName);
      updateStatus('Message sent!');
      setTimeout(() => navigation.navigate('Intersection'), 2000);
    } catch (error) {
      console.error('Failed to upload audio:', error);
      updateStatus('Failed to send message');
    }
  }

  const onTap = Gesture.Tap().onEnd(() => {
    if (recording) stopRecording();
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={onTap}>
        <LinearGradient
          colors={['#4A00E0', '#8E2DE2']}
          style={styles.gradientBackground}>
          <View style={styles.content}>
            <LottieView
              ref={animationRef}
              source={require('../../assets/wave.json')}
              style={styles.animation}
            />
            <Animated.Text style={[styles.statusText, {opacity: fadeAnim}]}>
              {status}
            </Animated.Text>
            {/* <Pressable
              style={styles.recordButton}
              onPress={() => (recording ? stopRecording() : startRecording())}>
              <Text style={styles.recordButtonText}>
                {recording ? 'Stop Recording' : 'Start Recording'}
              </Text>
            </Pressable> */}
          </View>
        </LinearGradient>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 300,
    height: 300,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonText: {
    fontSize: 18,
    color: '#3b5998',
    fontWeight: 'bold',
  },
});
