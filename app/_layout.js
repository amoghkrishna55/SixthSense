import { Stack } from "expo-router";

const RootLayer = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "SixthSense" }} />
      <Stack.Screen
        name="chat/index"
        options={{ headerTitle: "Sixth Sense" }}
      />
      <Stack.Screen
        name="vision/index"
        options={{ headerTitle: "Surrounding Sensor" }}
      />
      <Stack.Screen
        name="location/index"
        options={{ headerTitle: "Location" }}
      />
    </Stack>
  );
};

export default RootLayer;
