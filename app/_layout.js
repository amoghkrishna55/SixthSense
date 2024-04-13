import { Stack } from "expo-router";

const RootLayer = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "SixthSense" }} />
      <Stack.Screen
        name="chat/index"
        options={{ headerTitle: "Mental Health" }}
      />
      <Stack.Screen
        name="info/index"
        options={{ headerTitle: "Surrounding Sensor" }}
      />
    </Stack>
  );
};

export default RootLayer;
