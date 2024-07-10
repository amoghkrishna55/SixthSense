import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {ref, push, onValue} from 'firebase/database';
import {database} from '../../components/firebase';

const Message = ({navigation}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

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

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Message</Text>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter your message"
      />
      <Button title="Submit" onPress={handlePress} />
      <ScrollView style={styles.messagesContainer}>
        {[...messages].reverse().map(message => (
          <View key={message.id} style={styles.messageContainer}>
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageInfo}>
              Time: {formatTime(message.time)}
            </Text>
            <Text style={styles.messageInfo}>Status: {message.status}</Text>
          </View>
        ))}
      </ScrollView>
      <Button
        title="Back"
        onPress={() => navigation.navigate('Intersection')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  messagesContainer: {
    width: '90%',
    maxHeight: '50%',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageInfo: {
    fontSize: 12,
  },
});

export default Message;
