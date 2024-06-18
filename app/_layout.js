import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: "SixthSense" }} />
        <Stack.Screen
          name="chat/index"
          options={{ headerTitle: "Sixth Sense" }}
        />
        <Stack.Screen
          name="info/index"
          options={{ headerTitle: "Surrounding Sensor" }}
        />
        <Stack.Screen
          name="location/index"
          options={{ headerTitle: "Location" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayer;
