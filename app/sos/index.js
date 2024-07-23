import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {ref, onValue, update} from 'firebase/database';
import {database} from '../../components/firebase';
import Alert from '../../components/alert';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const SOS = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState([null, null, null, false]);

  useEffect(() => {
    const dbRef = ref(database, 'sosHistory');
    const listener = onValue(dbRef, snapshot => {
      const sosArray = [];
      const data = snapshot.val();
      for (let id in data) {
        sosArray.push({id, ...data[id]});
      }
      setMessages(sosArray);
    });
    return () => listener();
  }, []);

  const clearLogs = () => {
    setMessages([]);
    setAlert([null, null, null, false]);
    const rootRef = ref(database);
    update(rootRef, {sosHistory: {}})
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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A00E0', '#8E2DE2']}
        style={styles.background}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Intersection')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SOS History</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() =>
            setAlert([
              'Clear all messages?',
              clearLogs,
              () => setAlert([null, null, null, false]),
              true,
            ])
          }>
          <Ionicons name="trash-outline" size={24} color="#FF6A60" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.messagesContainer}>
        {[...messages].reverse().map(message => (
          <View key={message.id} style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <View style={styles.userInfo}>
                <Ionicons name="person" size={16} color="#FF6A60" />
                <Text style={styles.displayName}>{message.displayName}</Text>
              </View>
            </View>
            <View style={styles.timeInfo}>
              <Ionicons name="time-outline" size={16} color="#FF6A60" />
              <Text style={styles.messageTime}>{formatTime(message.time)}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#FF6A60" />
              <Text style={styles.locationText}>
                {message.latitude.toFixed(6)}, {message.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {alert[3] && alert[0] != null ? (
        <Alert alert={alert[0]} onTrue={alert[1]} onFalse={alert[2]} />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 4,
  },
  clearButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTime: {
    fontSize: 13,
    color: 'black',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: 'black',
    marginLeft: 4,
  },
});

export default SOS;
