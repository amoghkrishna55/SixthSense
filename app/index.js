import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import hommy from "../assets/hommy.png";
import { Link, router } from "expo-router";

export default function Home(props) {
  const {
    onPressMentalHealth,
    onPressSensor,
    titleMentalHealth = "Mental Health",
    titleSensor = "Surrounding Sensor",
  } = props;
  return (
    <ImageBackground source={hommy} style={styles.background}>
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={() => router.push("/chat")}>
          <Text style={styles.text}>{titleMentalHealth}</Text>
        </Pressable>
        <View style={styles.space} />
        <Pressable style={styles.button} onPress={() => router.push("/info")}>
          <Text style={styles.text}>{titleSensor}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/loaction")}
        >
          <Text style={styles.text}>{titleSensor}</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  space: {
    height: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
