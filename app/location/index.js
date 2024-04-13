import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Device from "expo-device";
import * as Location from "expo-location";
import axios from "axios";
import * as Speech from "expo-speech";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dist, setDist] = useState(null);
  const [lang, setLang] = useState(null);
  const [long, setLong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBeyond, setIsBeyond] = useState(false);

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

  useEffect(() => {
    if (location && lang && long) {
      setIsLoading(true);
      let dist = distance(
        location.coords.latitude,
        parseFloat(lang),
        location.coords.longitude,
        parseFloat(long)
      );
      if (dist > 5) {
        setIsBeyond(true);
      } else {
        Speech.speak("You are within the safe area.");
      }
      setDist(dist + "km");
      setIsLoading(false);
    }
  }, [location, lang, long]);

  useEffect(() => {
    Speech.speak(
      "Status of your current zone. Please wait while we fetch your location."
    );
    (async () => {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let client = await axios.get(
        "https://linkify.pockethost.io/api/collections/client/records/lr5n43fwme46jbn"
      );
      setLang(client.data.lang);
      setLong(client.data.long);
      setIsLoading(false);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.paragraph}>{dist}</Text>
          <Text style={styles.paragraph}>Client set Latitude : {lang}</Text>
          <Text style={styles.paragraph}>Client set Longitude : {long}</Text>
          {isBeyond && (
            <Text style={styles.beyond}>
              You are beyond the Safe Area set by the Client
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  beyond: {
    color: "red",
    fontSize: 22,
    textAlign: "center",
  },
});
