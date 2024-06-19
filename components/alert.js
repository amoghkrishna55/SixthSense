import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const { height, width } = Dimensions.get("window");

export default Alert = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>hello</Text>
        <View>
          <Pressable
            style={[
              styles.button,
              { flexDirection: "row", justifyContent: "center" },
            ]}
          >
            <Text style={styles.buttontext}>Continue </Text>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={23}
              color="#292927"
            />
          </Pressable>
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={styles.buttontext}>Maybe Later</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
  },
  innerContainer: {
    minHeight: 300,
    width: 350,
    backgroundColor: "#252F2C",
    borderRadius: 20,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 23,
    margin: 30,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    width: 200,
    alignItems: "center",
    backgroundColor: "#FF6A60",
    marginBottom: 20,
  },
  buttontext: {
    color: "#292927",
    fontSize: 20,
  },
});
