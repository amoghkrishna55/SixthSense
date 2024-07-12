import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {storage} from './firebase';
import {getDownloadURL, ref} from 'firebase/storage';
import {Audio} from 'expo-av';
import {database} from './firebase';
import {ref as databaseref, update} from 'firebase/database';

const Player = ({message}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sound, setSound] = useState();

  const updateAudioStatus = () => {
    const dbRef = databaseref(database, 'audio/' + message.id);
    update(dbRef, {status: 'read'}).catch(error =>
      console.error('Error updating data: ', error),
    );
  };
  useEffect(() => {
    let isComponentMounted = true;
    const playSound = async () => {
      if (isPlaying) {
        setIsDownloading(true);
        try {
          const url = await getDownloadURL(ref(storage, message.uri));
          console.log('Loading Sound');
          const {sound} = await Audio.Sound.createAsync(
            {uri: url},
            {shouldPlay: true},
            onPlaybackStatusUpdate,
          );
          if (!isComponentMounted) {
            await sound.unloadAsync();
            return;
          }
          setIsDownloading(false);
          setSound(sound);
          console.log('Playing Sound');
          await sound.playAsync();
        } catch (error) {
          console.error('Error playing sound', error);
          setIsPlaying(false);
        }
      }
    };

    const onPlaybackStatusUpdate = playbackStatus => {
      if (playbackStatus.didJustFinish) {
        console.log('Sound Finished');
        setIsPlaying(false);
        updateAudioStatus();
        if (sound) {
          sound.unloadAsync();
        }
        setSound(null);
      }
    };

    playSound();

    return () => {
      isComponentMounted = false;
    };
  }, [isPlaying, message.uri]);

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View key={message.id} style={styles.messageContainer}>
      <View style={styles.StatusContainer}></View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={styles.messageText}>{'Status: ' + message.status}</Text>
          <Text style={styles.messageInfo}>
            Time: {formatTime(message.date)}
          </Text>
        </View>
        <Pressable onPress={() => setIsPlaying(!isPlaying)}>
          <Ionicons
            name={isDownloading ? 'download' : isPlaying ? 'pause' : 'play'}
            size={40}
            color="#FF6A60"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 2,
    backgroundColor: '#292927',
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  messageInfo: {
    marginTop: 5,
    fontSize: 12,
    color: '#FF6A60',
    fontWeight: 'bold',
  },
  StatusContainer: {
    position: 'absolute',
    top: 2,
    right: 5,
    // right: 0, // Added to make the container full width
    // zIndex: 100, // Ensure the button is on top of the map
  },
});

export default Player;
