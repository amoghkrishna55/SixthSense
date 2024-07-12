import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {attachListener} from '../components/firebase';
import Button from '../components/button';
import {database} from '../components/firebase';
import {ref, onValue} from 'firebase/database';

const {width, height} = Dimensions.get('window');

const ClientInformation = () => {
  const [deviceName, setDeviceName] = useState('');
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    const deviceInfoRef = ref(database, 'device');
    const deviceValue = onValue(deviceInfoRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        setDeviceName(data.deviceName);
        setModelName(data.modelName);
      }
    });

    return () => deviceValue();
  }, []);

  return (
    <Animatable.View animation="fadeInUp" style={styles.clientInfo}>
      <Text style={styles.clientInfoTitle}>Client Information</Text>
      <View style={styles.clientInfoRow}>
        <Ionicons name="person" size={20} color="#fff" />
        <Text style={styles.clientInfoText}>
          {deviceName || 'No Device Registered'}
        </Text>
      </View>
      <View style={styles.clientInfoRow}>
        <Ionicons name="phone-portrait" size={20} color="#fff" />
        <Text style={styles.clientInfoText}>
          {modelName || 'No Device Registered'}
        </Text>
      </View>
    </Animatable.View>
  );
};

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Animatable.View animation="fadeIn" style={styles.header}>
      <LinearGradient
        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
        style={styles.headerGradient}>
        <View style={styles.greetingContainer}>
          <Animatable.Text
            animation="pulse"
            iterationCount={1}
            style={styles.greeting}>
            {greeting()}
          </Animatable.Text>
          <Text style={styles.adminText}>Admin</Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={24} color="#fff" />
          <Text style={styles.timeText}>
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animatable.View>
  );
};

export const Admin = ({setIsClient, navigation}) => {
  useEffect(() => {
    attachListener();
  }, []);
  return (
    <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ClientInformation />
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          style={styles.buttons}>
          <Button
            text="Change Role "
            onPress={() => setIsClient(null)}
            Ion="infinite"
          />
          <Button
            text="Inbox "
            onPress={() => navigation.navigate('Inbox')}
            Ion="mail-outline"
          />
          <Button
            text="Send Message "
            onPress={() => navigation.navigate('Message')}
            Ion="send-outline"
          />
          <Button
            text="Track Clients "
            onPress={() => navigation.navigate('Location')}
            Ion="location-outline"
          />
        </Animatable.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    width: width * 0.9,
    marginBottom: 20,
  },
  headerGradient: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  adminText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  timeText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  notificationButton: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4136',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: 20,
  },
  clientInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientInfoText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  buttons: {
    width: width * 0.9,
  },
});
