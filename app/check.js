import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import LottieView from 'lottie-react-native';
import Alert from '../components/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {detachListener} from '../components/firebase';

export const Check = ({setIsClient}) => {
  const animationRef = useRef(null);
  const [alert, setAlert] = useState([null, null, null, false]);

  const storage = async value => {
    try {
      await AsyncStorage.setItem('isClient', value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    detachListener();
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <>
      <View style={style.container}>
        <LottieView
          ref={animationRef}
          source={require('../assets/check_anim.json')}
          style={{width: 300, height: 300}}
        />
        <View style={style.buttonContainer}>
          <Pressable
            style={style.button}
            onPress={() =>
              setAlert([
                'Set device as Client',
                () => {
                  setIsClient(true), setAlert([null, null, null, false]);
                  storage('true');
                },
                () => setAlert([null, null, null, false]),
                true,
              ])
            }>
            <Text style={style.text}>Client</Text>
          </Pressable>
          <Pressable
            style={style.button}
            onPress={() =>
              setAlert([
                'Set device as Admin',
                () => {
                  setIsClient(false), setAlert([null, null, null, false]);
                  storage('false');
                },
                () => setAlert([null, null, null, false]),
                true,
              ])
            }>
            <Text style={style.text}>Admin</Text>
          </Pressable>
        </View>
      </View>
      {alert[3] && alert[0] != null ? (
        <Alert alert={alert[0]} onTrue={alert[1]} onFalse={alert[2]} />
      ) : null}
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EBEBE6',
    margin: 30,
    borderRadius: 60,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 30,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#FF6A60',
    borderRadius: 60,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#292927',
  },
});
