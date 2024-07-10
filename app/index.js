import React, {useState, useEffect} from 'react';
import Client from './client';
import {Admin} from './admin';
import {Check} from './check';
// import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {attachListener, detachListener} from '../components/firebase.mjs';

export default function Main({navigation}) {
  const [isClient, setIsClient] = useState(null);

  useEffect(() => {
    const getdata = async () => {
      try {
        const value = await AsyncStorage.getItem('isClient');
        if (value !== null) {
          setIsClient(value === 'true');
        }
      } catch (e) {
        console.log(e);
      }
    };
    getdata();
  }, []);

  useEffect(() => {
    if (isClient === false) {
      attachListener();
    } else {
      detachListener();
    }
  });
  return (
    <>
      {isClient === null ? (
        <Check setIsClient={setIsClient} />
      ) : isClient ? (
        <Client setIsClient={setIsClient} navigation={navigation} />
      ) : (
        <Admin setIsClient={setIsClient} navigation={navigation} />
      )}
      {/* <Toast /> */}
    </>
  );
}
