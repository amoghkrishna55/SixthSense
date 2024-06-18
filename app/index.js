import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import {
  LongPressGestureHandler,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import SOS from "../components/sos";

export default function App() {
  const onSwipeGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (Math.abs(nativeEvent.velocityX) > Math.abs(nativeEvent.velocityY)) {
        // Horizontal swipe
        if (nativeEvent.velocityX > 0) {
          console.log("Swipe right detected");
          // Navigate to Chat
        } else {
          console.log("Swipe left detected");
          // Navigate to Location
        }
      }
    } else {
      //   console.log("Vertical swipe");
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onSwipeGestureEvent}
      onHandlerStateChange={onSwipeGestureEvent}
    >
      <View style={styles.container}>
        <SOS>
          <View style={styles.innerContainer}>
            <Text>Long press to go to Info</Text>
            <Text>Swipe left to go to Location</Text>
            <Text>Swipe right to go to Chat</Text>
          </View>
        </SOS>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    padding: 20,
    backgroundColor: "#eee",
    margin: 10,
  },
  ball: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 1000, // large enough to create a circle shape
  },
});
