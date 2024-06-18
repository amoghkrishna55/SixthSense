import axios from "axios";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API;

export const gemini = async (photo64) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: "What is this picture?" },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: photo64,
                },
              },
            ],
          },
        ],
      }
    );
    console.log(response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log("Error sending photo to Gemini:", error);
    return "Error sending photo to gemini";
  }
};
