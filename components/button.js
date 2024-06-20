import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default Button = ({ text, onPress, Ion }) => {
  return (
    <Pressable
      style={[
        styles.button,
        { flexDirection: "row", justifyContent: "center" },
      ]}
      onPress={() => onPress()}
    >
      <Text style={styles.buttontext}>{text}</Text>
      <Ionicons name={Ion} size={23} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#292927",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  buttontext: {
    color: "white",
    fontSize: 20,
  },
});
