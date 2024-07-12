import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {attachListener} from '../components/firebase';
import Button from '../components/button';

export const Admin = ({setIsClient, navigation}) => {
  const currentHour = new Date().getHours();
  const [totalClient, setTotalClient] = useState('Loading...');
  const [trying, setTrying] = useState('Loading...');
  let greeting;

  useEffect(() => {
    attachListener();
  });

  if (currentHour < 12) {
    greeting = 'Good Morning';
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.clientCount}>Total Clients: {totalClient}</Text>
        <Text style={styles.clientCount}>Trying: {trying}</Text>
      </View>
      <View style={styles.buttons}>
        <Button
          text="Change Role "
          onPress={() => setIsClient(null)}
          Ion={'infinite'}
        />
        <Button
          text="Inbox "
          onPress={() => navigation.navigate('Inbox')}
          Ion={'mail-outline'}
        />
        <Button
          text="Send Message  "
          onPress={() => navigation.navigate('Message')}
          Ion={'send-outline'}
        />
        <Button
          text="Track Clients "
          onPress={() => navigation.navigate('Location')}
          Ion={'location-outline'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clientCount: {
    fontSize: 18,
    color: '#888',
  },
  buttons: {
    marginBottom: 50,
  },
});
