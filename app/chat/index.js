import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Touchable,
} from "react-native";
import axios from "axios";
import Chatbubble from "./ChatBubble.js";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import * as Speech from "expo-speech";

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API;

  useEffect(() => {
    Speech.speak("You are now talking Sixth Sense.");
  }, []);

  const handleUserInput = async () => {
    let updatedChat = [...chat, { role: "user", parts: [{ text: userInput }] }];
    setLoading(true);

    try {
      console.log("API_KEY", API_KEY);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: updatedChat,
        }
      );

      console.log(response.data.candidates[0].content.parts[0].text);
      const modelResponse =
        response.data?.candidates?.[0]?.parts?.[0]?.text || "";

      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          { role: "model", parts: [{ text: modelResponse }] },
        ];
        setChat(updatedChatWithModel);
        setUserInput("");
      }
    } catch (error) {
      console.error("Error sending message to model:", error);
      console.error("Error response:", error.response);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSpeech = async (text) => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => (
    <Chatbubble
      role={item.role}
      text={item.parts[0].text}
      onSpeech={() => handleSpeech(item.parts[0].text)}
    />
  );

  return (
    <View style={StyleSheet.container}>
      <Text style={styles.title}>Chatbot</Text>
      <FlatList
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={userInput}
          onChangeText={setUserInput}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleUserInput}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator style={styles.loading} color="#333" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginRight: 10,
    padding: 8,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 25,
    color: "#333",
    backgroundColor: "#f0f0f0",
  },
  button: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "blue",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Chatbot;
