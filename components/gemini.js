import axios from 'axios';
import {GEMINI_KEY} from '@env';

export const gemini = async photo64 => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [
          {
            parts: [
              {text: 'What is this picture?'},
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: photo64,
                },
              },
            ],
          },
        ],
      },
    );
    console.log(response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.response) {
      console.log('Error data:', error.response.data);
      console.log('Error status:', error.response.status);
    } else if (error.request) {
      console.log('Error request:', error.request);
    } else {
      console.log('Error message:', error.message);
    }
    console.log('Error config:', error.config);
    return "There seems to be an error. I'm sorry, I cannot process this image.";
  }
};
