import React, {useRef, forwardRef, useState} from 'react';
import {Animated, Dimensions, Text, View, StyleSheet} from 'react-native';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {runSOS} from './firebase.js';
import * as Speech from 'expo-speech';

const {height} = Dimensions.get('window');

const SOS = forwardRef(({children}, ref) => {
  const [text, setText] = useState('Keep holding to send SOS');
  const sizeAnim = useRef(new Animated.Value(0)).current;
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const textOpacity = sizeAnim.interpolate({
    inputRange: [0, 1.8 * height],
    outputRange: [0, 5],
  });

  const shrinkCircle = () => {
    Animated.timing(sizeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      if (sizeAnim._value === 0) {
        setText('Keep holding to send SOS');
      }
    });
  };

  const onLongPressGestureEvent = ({nativeEvent}) => {
    if (nativeEvent.state === State.ACTIVE) {
      posX.setValue(nativeEvent.x);
      posY.setValue(nativeEvent.y);

      Animated.timing(sizeAnim, {
        toValue: 1.8 * height,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        if (sizeAnim._value === 1.8 * height) {
          console.log('SOS sent');
          Speech.speak('SOS ACTIVATED');
          runSOS();
          setText('SOS sent');
          ReactNativeHapticFeedback.trigger('impactHeavy', options);
          setTimeout(() => {
            shrinkCircle();
          }, 500);
        }
      });
    } else if (
      nativeEvent.state === State.END ||
      nativeEvent.state === State.FAILED ||
      nativeEvent.state === State.CANCELLED
    ) {
      shrinkCircle();
    }
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={onLongPressGestureEvent}
      minDurationMs={100}>
      <View style={styles.container}>
        {children}
        <Animated.View
          ref={ref}
          style={{
            position: 'absolute',
            backgroundColor: '#FF6A60',
            borderRadius: 1000,
            width: sizeAnim,
            height: sizeAnim,
            left: Animated.subtract(posX, Animated.divide(sizeAnim, 2)),
            top: Animated.subtract(posY, Animated.divide(sizeAnim, 2)),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            opacity: textOpacity,
          }}>
          <Text style={{color: 'white', fontSize: 20}}>{text}</Text>
        </Animated.View>
      </View>
    </LongPressGestureHandler>
  );
});

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
});

export default SOS;
