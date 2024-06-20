import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import Button from "../components/button";

export const Admin = ({ setIsClient }) => {
  const currentHour = new Date().getHours();
  const [totalClient, setTotalClient] = useState("Loading...");
  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.clientCount}>Total Clients: {totalClient}</Text>
      </View>
      <View style={styles.buttons}>
        <Button text="Check" onPress={() => setIsClient(null)} />
        <Button
          text="Inbox "
          onPress={() => setIsClient(null)}
          Ion={"chatbubbles-outline"}
        />
        <Button
          text="Send Message  "
          onPress={() => setIsClient(null)}
          Ion={"send-outline"}
        />
        <Button
          text="Track Clients "
          onPress={() => setIsClient(null)}
          Ion={"location-outline"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginTop: 50,
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clientCount: {
    fontSize: 18,
    color: "#888",
  },
  buttons: {
    marginBottom: 50,
  },
});
