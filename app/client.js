import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {detachListener} from '../components/firebase.js';
import SOS from '../components/sos';
import {database} from '../components/firebase.js';
import {ref, update, onValue} from 'firebase/database';
import * as Location from 'expo-location';
import {updateDevice} from '../components/firebase.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/button.js';
import * as Speech from 'expo-speech';

export default function Client({setIsClient, navigation}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [outsideboundary, setoutsideBoundary] = useState(false);

  useEffect(() => {
    let intervalId;
    const warning = () => {
      Speech.speak(
        'You are outside the boundary, please return to the designated area',
      );
    };
    if (outsideboundary) {
      warning();
      intervalId = setInterval(warning, 10000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [outsideboundary]);

  useEffect(() => {
    const dbRef = ref(database, 'boundary');
    const listener = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const distanceFromBoundary = distance(
          latitude,
          data.latitude,
          longitude,
          data.longitude,
        );
        console.log('Distance from boundary:', distanceFromBoundary);
        if (distanceFromBoundary > data.radius / 1000) {
          console.log('Out of boundary');
          if (latitude != 0 && longitude != 0) setoutsideBoundary(true);
        } else {
          console.log('Inside boundary');
          setoutsideBoundary(false);
        }
      }
    });
    return () => listener();
  }, [latitude, longitude]);

  const distance = (lat1, lat2, lon1, lon2) => {
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    let r = 6371;

    return c * r;
  };

  useEffect(() => {
    let locationSubscription;

    const getLocationUpdates = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 0,
        },
        location => {
          console.log('Location changed');
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
          const rootRef = ref(database);
          update(rootRef, {
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        },
      );
    };
    detachListener();
    updateDevice(true);
    getLocationUpdates();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);
  const onSwipeGestureEvent = ({nativeEvent}) => {
    if (nativeEvent.state === State.END) {
      if (Math.abs(nativeEvent.velocityX) > Math.abs(nativeEvent.velocityY)) {
        if (nativeEvent.velocityX > 0) {
          console.log('Swipe right detected');
          // navigation.navigate('Location');
        } else {
          console.log('Swipe left detected');
          navigation.navigate('Vision');
        }
      } else {
        if (nativeEvent.velocityY > 0) {
          console.log('Swipe down detected');
          navigation.navigate('ReadMessage');
        } else {
          console.log('Swipe up detected');
          navigation.navigate('SendMessage');
        }
      }
    }
  };

  return outsideboundary ? (
    <View style={styles.outsideBoundaryScreen}>
      <View style={styles.warningContainer}>
        <Ionicons name="warning-outline" size={80} color="#FFD700" />
        <Text style={styles.warningTitle}>Outside Boundary</Text>
        <Text style={styles.warningText}>
          You have left the designated area. Please return to continue using the
          app.
        </Text>
      </View>
    </View>
  ) : (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onSwipeGestureEvent}
        onHandlerStateChange={onSwipeGestureEvent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Button
              text="Back "
              onPress={() => setIsClient(null)}
              Ion={'arrow-back-outline'}
              style={{
                margin: 0,
                padding: 2,
                borderRadius: 0,
              }}
            />
          </View>

          <SOS>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Ionicons name="swap-horizontal" size={40} color="#4A90E2" />
                <Text style={styles.cardTitle}>Swipe Left</Text>
                <Text style={styles.cardText}>Navigate to Vision</Text>
              </View>
              <View style={styles.card}>
                <Ionicons name="swap-vertical" size={40} color="#50C878" />
                <Text style={styles.cardTitle}>Swipe Up/Down</Text>
                <Text style={styles.cardText}>Send/Read Messages</Text>
              </View>
              <View style={styles.card}>
                <Ionicons name="hand-left" size={40} color="#FF6347" />
                <Text style={styles.cardTitle}>Hold</Text>
                <Text style={styles.cardText}>Activate SOS</Text>
              </View>
            </View>
          </SOS>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  innerContainer: {
    padding: 20,
    backgroundColor: '#eee',
    margin: 10,
  },
  ball: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 1000,
  },
  outsideBoundaryScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 20, 60, 0.9)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  warningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC143C',
    marginVertical: 20,
  },
  warningText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
});
