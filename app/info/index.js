import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import axios from "axios";
import * as Speech from "expo-speech";

export default function CaptureInfo() {
  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photoDetails, setPhotoDetails] = useState(null);
  const [apiResults, setApiResults] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    Speech.speak(
      "You have clicked on surrouding sensor. Please take a picture."
    );
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });
        setPhotoDetails(photo);
        await sendPhotoToGemini(photo.base64);
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
  };

  const sendPhotoToGemini = async (base64Photo) => {
    console.log(GOOGLE_API_KEY);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GOOGLE_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: "What is this picture?" },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Photo,
                  },
                },
              ],
            },
          ],
        }
      );
      console.log(response.data.candidates[0].content.parts[0].text);
      setApiResults(response.data.candidates[0].content.parts[0].text);
      Speech.speak(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error sending photo to Gemini:", error);
    }
  };

  const closeModal = () => {
    setPhotoDetails(null);
    setApiResults(null);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={() => takePicture()}>
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          autoFocus="on"
        />

        {(photoDetails || apiResults) && (
          <Modal visible={true} transparent={true}>
            <View style={styles.modalContainer}>
              {photoDetails && (
                <Image
                  source={{ uri: photoDetails.uri }}
                  style={styles.modalImage}
                />
              )}
              {apiResults && (
                <View>
                  <Text style={styles.modalText}>
                    {JSON.stringify(apiResults)}
                  </Text>
                </View>
              )}
              <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
