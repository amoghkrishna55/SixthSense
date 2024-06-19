import { Pressable, Text } from "react-native";

export const Admin = ({ setIsClient }) => {
  return (
    <Pressable onPress={() => setIsClient(null)}>
      <Text>Check</Text>
    </Pressable>
  );
};
