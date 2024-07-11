import React, {useState, useEffect} from 'react';
import Client from './client';
import {Admin} from './admin';
import {Check} from './check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {attachListener, detachListener} from '../components/firebase.js';

export default function Main({navigation}) {
  const [isClient, setIsClient] = useState(null);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      try {
        const value = await AsyncStorage.getItem('isClient');
        if (value != null) {
          setIsClient(value === 'true');
        }
      } catch (e) {
        console.log(e);
      }
      setIsRunning(false);
    };
    getdata();
  }, []);

  // useEffect(() => {
  //   if (isClient === false) {
  //     attachListener();
  //   } else {
  //     detachListener();
  //   }
  // });
  return (
    <>
      {!isRunning ? (
        isClient === null ? (
          <Check setIsClient={setIsClient} />
        ) : isClient ? (
          <Client setIsClient={setIsClient} navigation={navigation} />
        ) : (
          <Admin setIsClient={setIsClient} navigation={navigation} />
        )
      ) : (
        <></>
      )}
    </>
  );
}
