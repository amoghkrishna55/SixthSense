import * as Speech from 'expo-speech';
import {database} from '../../components/firebase';
import React, {useEffect, useRef, useState} from 'react';
import {ref, get, child, update} from 'firebase/database';
import {View, Text, StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import {LinearGradient} from 'expo-linear-gradient';

function speakMessage(message) {
  return new Promise(resolve => {
    Speech.speak(message, {
      onDone: resolve,
    });
  });
}

export default function ReadMessage({navigation}) {
  const animationRef = useRef(null);
  const [status, setStatus] = useState('Loading messages...');
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
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  useEffect(() => {
    async function fetchAndSpeakMessages() {
      updateStatus('Fetching messages...');
      const messagesRef = ref(database, 'messages');
      try {
        const snapshot = await get(child(messagesRef, '/'));
        if (snapshot.exists()) {
          const updates = {};
          const messagesArray = [];
          let unreadCount = 0;
          snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            if (childSnapshot.val().status === 'unread') {
              messagesArray.push(childSnapshot.val().text);
              updates[`/messages/${key}/status`] = 'read';
              unreadCount++;
            }
          });
          updateStatus(
            `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`,
          );
          await speakMessage(
            `You have ${unreadCount} unread ${
              unreadCount === 1 ? 'message' : 'messages'
            }`,
          );
          for (let i = 0; i < messagesArray.length; i++) {
            updateStatus(`Reading message ${i + 1} of ${messagesArray.length}`);
            await speakMessage(`Message ${i + 1}`);
            await speakMessage(messagesArray[i]);
          }
          if (unreadCount > 0) {
            await update(ref(database), updates);
            console.log('All messages updated to read.');
          }
        } else {
          console.log('No messages found.');
          updateStatus('No messages found');
          await speakMessage('No messages found');
        }
      } catch (error) {
        console.error('Error reading messages: ', error);
        updateStatus('Error reading messages');
      }
      setTimeout(() => navigation.navigate('Intersection'), 2000);
    }
    fetchAndSpeakMessages();
  }, []);

  return (
    <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.container}>
      <View style={styles.content}>
        <LottieView
          ref={animationRef}
          source={require('../../assets/wave.json')}
          style={styles.animation}
        />
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
});
