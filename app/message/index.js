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
import Ionicons from '@expo/vector-icons/Ionicons';
const Message = ({navigation}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState([null, null, null, false]);

  useEffect(() => {
    const dbRef = ref(database, 'messages');
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

  const handlePress = () => {
    if (inputText !== '') {
      Keyboard.dismiss();
      const dbRef = ref(database, 'messages');
      push(dbRef, {
        text: inputText,
        time: new Date().getTime(),
        status: 'unread',
      }).catch(error => {
        console.error('Error adding data: ', error);
      });
      setInputText('');
    }
  };

  const clearLogs = () => {
    setMessages([]);
    setAlert([null, null, null, false]);
    const rootRef = ref(database);
    update(rootRef, {messages: {}})
      .catch(error => console.error('Update failed:', error))
      .then(() => console.log('Successfully cleared logs'));
  };

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <>
      <View style={styles.container}>
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
            <View key={message.id} style={styles.messageContainer}>
              <View style={styles.StatusContainer}>
                {message.status === 'unread' ? (
                  <Ionicons name="close" size={25} color="#FF6A60" />
                ) : (
                  <Ionicons name="checkmark-done" size={25} color="#FF6A60" />
                )}
              </View>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageInfo}>
                Time: {formatTime(message.time)}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter your message"
          />
          <Button
            text="Send Message "
            onPress={handlePress}
            Ion="caret-forward-sharp"
            style={{borderRadius: 0, margin: 0}}
          />
        </View>
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
    backgroundColor: '#EBEBE6',
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

export default Message;
