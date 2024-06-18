import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import SOS from "../components/sos";
import { router } from "expo-router";

export default function App() {
  const onSwipeGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (Math.abs(nativeEvent.velocityX) > Math.abs(nativeEvent.velocityY)) {
        if (nativeEvent.velocityX > 0) {
          console.log("Swipe right detected");
          router.push("/chat");
        } else {
          console.log("Swipe left detected");
          router.push("/vision");
        }
      }
    } else {
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={onSwipeGestureEvent}
        onHandlerStateChange={onSwipeGestureEvent}
      >
        <View style={styles.container}>
          <SOS>
            <View style={styles.innerContainer}>
              <Text>Long press to activate SOS</Text>
              <Text>Swipe left to go to Vision</Text>
              <Text>Swipe right to go to Chat</Text>
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
