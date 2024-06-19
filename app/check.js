import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import LottieView from "lottie-react-native";

export const Check = ({ setIsClient }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View style={style.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/check_anim.json")}
        style={{ width: 300, height: 300 }}
      />
      <View style={style.buttonContainer}>
        <Pressable style={style.button} onPress={() => setIsClient(true)}>
          <Text style={style.text}>Client</Text>
        </Pressable>
        <Pressable style={style.button} onPress={() => setIsClient(false)}>
          <Text style={style.text}>Admin</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EBEBE6",
    margin: 30,
    borderRadius: 60,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 30,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#FF6A60",
    borderRadius: 60,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#292927",
  },
});
