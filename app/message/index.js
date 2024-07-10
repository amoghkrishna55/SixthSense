import {ref, push} from 'firebase/database';
import {database} from '../../components/firebase';
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

const Message = ({navigation}) => {
  const [inputText, setInputText] = useState('');

  const handlePress = () => {
    // Handle the button press here
    if (inputText !== '') {
      const dbRef = ref(database, 'messages');
      push(dbRef, {
        text: inputText,
        time: new Date().getTime(),
        status: 'unread',
      }).catch(error => {
        console.error('Error adding data: ', error);
      });
      console.log('Data added');
      setInputText('');
      navigation.navigate('Intersection');
    }
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
  },
});

export default Message;
