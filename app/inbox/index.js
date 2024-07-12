import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {ref, push, onValue, update} from 'firebase/database';
import {database} from '../../components/firebase';
import Button from '../../components/button';
import Alert from '../../components/alert';
import Player from '../../components/player';
import {storage} from '../../components/firebase';
import {deleteObject, ref as storageref, listAll} from 'firebase/storage';
import {LinearGradient} from 'expo-linear-gradient';

const Inbox = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState([null, null, null, false]);

  useEffect(() => {
    const dbRef = ref(database, 'audio');
    const listener = onValue(dbRef, snapshot => {
      const messagesArray = [];
      const data = snapshot.val();
      for (let id in data) {
        messagesArray.push({id, ...data[id]});
      }
      setMessages(messagesArray);
    });
    return () => listener();
  }, []);

  const clearLogs = () => {
    setMessages([]);
    setAlert([null, null, null, false]);
    const rootRef = ref(database);
    const storageRef = storageref(storage, '/audio');
    update(rootRef, {audio: {}})
      .catch(error => console.error('Update failed:', error))
      .then(() => console.log('Successfully cleared logs'));

    listAll(storageRef)
      .then(res => {
        res.items.forEach(itemRef => {
          deleteObject(itemRef)
            .then(() => console.log(`Successfully deleted ${itemRef.fullPath}`))
            .catch(error =>
              console.error(`Error deleting ${itemRef.fullPath}:`, error),
            );
        });
      })
      .catch(error => {
        console.error('Error listing audio files:', error);
      });
  };

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          colors={['#4A00E0', '#8E2DE2']}
          style={styles.background}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Button
            text="Back "
            onPress={() => navigation.navigate('Intersection')}
            Ion={'arrow-back-outline'}
          />
          <Button
            text="Clear Logs "
            onPress={() =>
              setAlert([
                'Clear all messages?',
                clearLogs,
                () => setAlert([null, null, null, false]),
                true,
              ])
            }
            Ion="trash-outline"
          />
        </View>
        <ScrollView style={styles.messagesContainer}>
          {[...messages].reverse().map(message => (
            <Player message={message} />
          ))}
        </ScrollView>
      </View>
      {alert[3] && alert[0] != null ? (
        <Alert alert={alert[0]} onTrue={alert[1]} onFalse={alert[2]} />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    width: '100%',
    fontSize: 16,
    borderColor: '#292927',
  },
  messagesContainer: {
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 2,
    backgroundColor: '#252F2C',
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
  bottomContainer: {
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  StatusContainer: {
    position: 'absolute',
    top: 2,
    right: 5,
    // right: 0, // Added to make the container full width
    // zIndex: 100, // Ensure the button is on top of the map
  },
});

export default Inbox;
