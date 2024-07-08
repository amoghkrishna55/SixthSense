import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Pressable, Text } from "react-native";
import Button from "../../components/button";
import { router } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        text="Back "
        onPress={() => router.push("/")}
        Ion={"arrow-back-outline"}
        style={{
          position: "sticky",
          top: 10,
          left: 10,
          backgroundColor: "rgba(255,255,255,0.7)",
          paddingHorizontal: 20,
          zIndex: 100,
        }}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <View style={styles.buttonContainer}>
        <Button
          text="Change Boundary "
          onPress={() => setIsClient(null)}
          Ion={"locate-outline"}
          style={{
            position: "absolute",
            bottom: 10,
            backgroundColor: "rgba(255,255,255,0.7)", // Temporary background color for visibility
            width: "100%", // Ensure the button stretches to fill the container
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    // position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0, // Added to make the container full width
    zIndex: 100, // Ensure the button is on top of the map
  },
  buttonText: {
    color: "black",
  },
});
