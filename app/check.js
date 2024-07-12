import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {detachListener} from '../components/firebase';
import NetInfo from '@react-native-community/netinfo';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('window');

export const Check = ({setIsClient}) => {
  const [networkQuality, setNetworkQuality] = useState('Checking...');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(null);

  const storage = async value => {
    try {
      await AsyncStorage.setItem('isClient', value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    detachListener();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setNetworkQuality(state.isInternetReachable ? 'Good' : 'Limited');
      } else {
        setNetworkQuality('No Connection');
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePress = isClient => {
    setAlertMessage(isClient ? 'Set device as Client' : 'Set device as Admin');
    setAlertAction(() => () => {
      setIsClient(isClient);
      storage(isClient.toString());
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  return (
    <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animatable.View animation="fadeIn" style={styles.networkInfo}>
        <Ionicons name="wifi" size={24} color="#fff" />
        <Text style={styles.networkText}>Network: {networkQuality}</Text>
      </Animatable.View>
      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Choose Your Role
      </Animatable.Text>
      <View style={styles.buttonContainer}>
        <Animatable.View animation="fadeInLeft">
          <Pressable style={styles.button} onPress={() => handlePress(true)}>
            <LinearGradient
              colors={['#FF512F', '#F09819']}
              style={styles.buttonGradient}>
              <Ionicons name="person" size={40} color="#fff" />
              <Text style={styles.buttonText}>Client</Text>
            </LinearGradient>
          </Pressable>
        </Animatable.View>
        <Animatable.View animation="fadeInRight">
          <Pressable style={styles.button} onPress={() => handlePress(false)}>
            <LinearGradient
              colors={['#1A2980', '#26D0CE']}
              style={styles.buttonGradient}>
              <Ionicons name="settings-sharp" size={40} color="#fff" />
              <Text style={styles.buttonText}>Admin</Text>
            </LinearGradient>
          </Pressable>
        </Animatable.View>
      </View>
      {showAlert && (
        <Animatable.View animation="slideInUp" style={styles.alertContainer}>
          <Text style={styles.alertText}>{alertMessage}</Text>
          <View style={styles.alertButtons}>
            <Pressable style={styles.alertButton} onPress={alertAction}>
              <Text style={styles.alertButtonText}>Confirm</Text>
            </Pressable>
            <Pressable
              style={styles.alertButton}
              onPress={() => setShowAlert(false)}>
              <Text style={styles.alertButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Animatable.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  networkText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: width * 0.4,
    height: height * 0.25,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  alertContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  alertText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  alertButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  alertButtonText: {
    color: '#4A00E0',
    fontWeight: 'bold',
  },
});
