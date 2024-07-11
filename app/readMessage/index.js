import * as Speech from 'expo-speech';
import {database} from '../../components/firebase';
import React, {useEffect, useRef} from 'react';
import {ref, get, child, update} from 'firebase/database';
import {View, Text} from 'react-native';
import Button from '../../components/button';
import LottieView from 'lottie-react-native';

function speakMessage(message) {
  return new Promise(resolve => {
    Speech.speak(message, {
      onDone: resolve,
    });
  });
}

export default function ReadMessage({navigation}) {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  useEffect(() => {
    async function fetchAndSpeakMessages() {
      Speech.speak('Reading messages');
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

          await speakMessage(
            `You have ${unreadCount} unread ${
              unreadCount === 1 ? 'message' : 'messages'
            }`,
          );
          for (let i = 0; i < messagesArray.length; i++) {
            await speakMessage(`Message ${i + 1}`);
            await speakMessage(messagesArray[i]);
          }
          if (unreadCount > 0) {
            await update(ref(database), updates);
            console.log('All messages updated to read.');
          }
        } else {
          console.log('No messages found.');
          await speakMessage('No messages found');
        }
      } catch (error) {
        console.error('Error reading messages: ', error);
      }
      navigation.navigate('Intersection');
    }

    fetchAndSpeakMessages();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        ref={animationRef}
        source={require('../../assets/wave.json')}
        style={{width: 300, height: 300}}
      />
      <Text>Read Messages</Text>
      <Button text="Test" onPress={() => navigation.navigate('Intersection')} />
    </View>
  );
}
