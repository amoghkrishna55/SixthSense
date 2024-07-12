import {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet, Button, Pressable} from 'react-native';
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

export default function SendMessage({navigation}) {
  const [recording, setRecording] = useState();
  const animationRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const playBeepAfterSpeech = async () => {
        if (animationRef.current) {
          animationRef.current.play();
        }
        // await speak('Sending Message');
        // await speak('Speak your message after the beep');
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

  async function startRecording() {
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
  }

  async function stopRecording() {
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
      navigation.navigate('Intersection');
    } catch (error) {
      console.error('Failed to upload audio:', error);
    }
  }

  const onTap = Gesture.Tap().onEnd(() => {
    if (recording) stopRecording();
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={onTap}>
        <View style={styles.container}>
          <LottieView
            ref={animationRef}
            source={require('../../assets/wave.json')}
            style={{width: 300, height: 300}}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
