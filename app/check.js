import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
  TextInput,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {detachListener, getAdminPassword} from '../components/firebase';
import NetInfo from '@react-native-community/netinfo';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Crypto from 'expo-crypto';

const {width, height} = Dimensions.get('window');

export const Check = ({setIsClient}) => {
  const [networkQuality, setNetworkQuality] = useState('Checking...');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [isError, setIsError] = useState(false);

  const shakeAnimation = new Animated.Value(0);

  const storage = async value => {
    try {
      await AsyncStorage.setItem('isClient', value);
    } catch (e) {
      console.log(e);
    }
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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

  const hashPassword = async password => {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password,
    );
    return hash;
  };

  const checkAdminPassword = async () => {
    const hashedPassword = await hashPassword(adminPassword);
    console.log(hashedPassword);
    const correctPassword = await getAdminPassword();
    console.log(correctPassword);
    return hashedPassword === correctPassword;
  };

  const handlePress = async isClient => {
    if (isClient) {
      setAlertMessage('Set device as Client');
      setShowAdminInput(false);
      setIsError(false);
      setAlertAction(() => () => {
        setIsClient(true);
        storage('true');
        setShowAlert(false);
      });
      setShowAlert(true);
    } else {
      setShowAdminInput(true);
      setShowAlert(false);
    }
  };

  const handleAdminSubmit = async () => {
    const isCorrect = await checkAdminPassword();
    if (isCorrect) {
      setIsClient(false);
      storage('false');
      setShowAdminInput(false);
    } else {
      setIsError(true);
      alert('Incorrect password');
      shakeError();
    }
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
      {showAdminInput && (
        <Animatable.View animation="fadeIn" style={styles.adminInputContainer}>
          <Animated.View style={{transform: [{translateX: shakeAnimation}]}}>
            <TextInput
              style={[
                styles.adminInput,
                isError && {borderColor: 'red', borderWidth: 2},
              ]}
              placeholder="Enter admin password"
              placeholderTextColor="#999"
              secureTextEntry
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
          </Animated.View>
          <Pressable
            style={styles.adminSubmitButton}
            onPress={handleAdminSubmit}>
            <Text style={styles.adminSubmitButtonText}>Submit</Text>
          </Pressable>
        </Animatable.View>
      )}
      {showAlert && (
        <Animatable.View animation="slideInUp" style={styles.alertContainer}>
          <Text style={styles.alertText}>{alertMessage}</Text>
          <View style={styles.alertButtons}>
            {alertAction && (
              <Pressable style={styles.alertButton} onPress={alertAction}>
                <Text style={styles.alertButtonText}>Confirm</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.alertButton}
              onPress={() => setShowAlert(false)}>
              <Text style={styles.alertButtonText}>Close</Text>
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
  adminInputContainer: {
    width: '80%',
    marginTop: 20,
  },
  adminInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
  adminSubmitButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  adminSubmitButtonText: {
    color: '#4A00E0',
    fontWeight: 'bold',
  },
});
