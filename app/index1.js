import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  TouchableWithoutFeedback,
  Alert,
  Button,
} from "react-native";
import hommy from "../assets/hommy.png";
import { router } from "expo-router";
import * as Location from "expo-location";
import axios from "axios"; // Import axios
import * as Speech from "expo-speech";
import Pocketbase from "pocketbase";

export default function Home(props) {
  const [serverLang, setServerLang] = useState(null);
  const [serverLong, setServerLong] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sos, setSos] = useState(false);
  const pb = new Pocketbase("https://linkify.pockethost.io");

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

  const sendSOS = async () => {
    try {
      const data = {
        curlong: deviceLocation.coords.longitude,
        curlang: deviceLocation.coords.latitude,
        status: 1,
      };
      const record = await pb
        .collection("client")
        .update("lr5n43fwme46jbn", data);
    } catch {
      console.log("error");
    }
  };

  const showAlert = () => {
    Speech.speak(
      "You are beyond the safe area. Please go back to the safe area."
    );
    Alert.alert(
      "Caution!",
      "You are beyond the safe area. Please go back to the safe area.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  useEffect(() => {
    if (serverLang && serverLong && deviceLocation) {
      let dist = distance(
        deviceLocation.coords.latitude,
        parseFloat(serverLang),
        deviceLocation.coords.longitude,
        parseFloat(serverLong)
      );
      if (dist > 5) {
        showAlert();
      }
    }
  }, [serverLang, serverLong, deviceLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        // Call the async function immediately
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setDeviceLocation(location);
        let client = await axios.get(
          "https://linkify.pockethost.io/api/collections/client/records/lr5n43fwme46jbn"
        );
        setServerLang(client.data.lang);
        setServerLong(client.data.long);
      })();
    }, 10000);
    return () => clearInterval(interval); // Cleanup interval
  }, [setDeviceLocation, setServerLang, setServerLong, setErrorMsg]);

  const {
    titleMentalHealth = "Sixth Sense",
    titleSensor = "Surrounding Sensor",
  } = props;
  return sos ? (
    <TouchableWithoutFeedback onPress={() => setSos(false)}>
      <View style={styles.container}>
        <Text>Press Anywhere to Deactivate</Text>
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <ImageBackground source={hommy} style={styles.background}>
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={() => router.push("/chat")}>
          <Text style={styles.text}>{titleMentalHealth}</Text>
        </Pressable>
        <View style={styles.space} />
        <Pressable style={styles.button} onPress={() => router.push("/info")}>
          <Text style={styles.text}>{titleSensor}</Text>
        </Pressable>
        <View style={styles.space} />
        <Pressable
          style={styles.button}
          onPress={() => router.push("/location")}
        >
          <Text style={styles.text}>Safe Area</Text>
        </Pressable>
        <View style={styles.space2} />
        <Pressable
          style={styles.button2}
          onPress={() => (
            setSos(true), Speech.speak("SOS activated"), sendSOS()
          )}
        >
          <Text style={styles.text}>SOS</Text>
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
  space2: {
    height: 50,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  button2: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 35,
    borderRadius: 100,
    elevation: 3,
    backgroundColor: "red",
  },
});
