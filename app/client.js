import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import SOS from '../components/sos';
// import { router } from "expo-router";
import {database} from '../components/firebase.js';
import {ref, update} from 'firebase/database';
// import * as Location from "expo-location";

export default function Client({setIsClient, navigation}) {
  // useEffect(() => {
  //   let intervalId;

  //   const getLocation = async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     console.log(location.coords.latitude, location.coords.longitude);
  //     const rootRef = ref(database);
  //     update(rootRef, {
  //       location: {
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //       },
  //     });
  //   };

  //   const startLoggingLocation = async () => {
  //     intervalId = setInterval(async () => {
  //       await getLocation();
  //     }, 10000); // Fetch location every 10 seconds
  //   };

  //   startLoggingLocation();

  //   return () => {
  //     clearInterval(intervalId); // Clear the interval on component unmount
  //   };
  // }, []);
  const onSwipeGestureEvent = ({nativeEvent}) => {
    if (nativeEvent.state === State.END) {
      if (Math.abs(nativeEvent.velocityX) > Math.abs(nativeEvent.velocityY)) {
        if (nativeEvent.velocityX > 0) {
          console.log('Swipe right detected');
          // router.push("/location");
          navigation.navigate('Location');
        } else {
          console.log('Swipe left detected');
          // router.push("/vision");
        }
      }
    } else {
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PanGestureHandler
        onGestureEvent={onSwipeGestureEvent}
        onHandlerStateChange={onSwipeGestureEvent}>
        <View style={styles.container}>
          <Pressable onPress={() => setIsClient(null)}>
            <Text>Click here to go back</Text>
          </Pressable>
          <SOS>
            <View style={styles.innerContainer}>
              <Text>Keep holding to activate SOS</Text>
              <Text>Swipe left to go to Vision</Text>
              <Text>Swipe right to go to Location</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
});
