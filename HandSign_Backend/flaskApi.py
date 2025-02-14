from flask import Flask, request, jsonify
import numpy as np
import cv2
from tensorflow.keras.models import model_from_json
import operator
from string import ascii_uppercase
import os
import base64

app = Flask(__name__)

class SignLanguagePredictor:
    def __init__(self):
        # Load the main model
        json_file = open("model-H5/model_new.json", "r")
        model_json = json_file.read()
        json_file.close()
        self.loaded_model = model_from_json(model_json)
        self.loaded_model.load_weights("model-H5/model_new.weights.h5")
        print("Model loaded successfully")

    def preprocess_image(self, image):
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # Apply Gaussian blur
        blur = cv2.GaussianBlur(gray, (5, 5), 2)
        # Apply adaptive thresholding 
        th3 = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
        # Apply Otsu's thresholding
        ret, res = cv2.threshold(th3, 70, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        # Resize image
        resized_image = cv2.resize(res, (128, 128))
        return resized_image

    def predict(self, image):
        # Preprocess the image
        processed_image = self.preprocess_image(image)
        # Get initial prediction
        result = self.loaded_model.predict(processed_image.reshape(1, 128, 128, 1))
        # Initial predictions
        prediction = {'blank': result[0][0]}
        for i, letter in enumerate(ascii_uppercase):
            print (i, letter)
            prediction[letter] = result[0][i + 1]
            print(f'{letter}: {result[0][i + 1]}')
        prediction = sorted(prediction.items(), key=operator.itemgetter(1), reverse=True)
        current_symbol = prediction[0][0]
        return current_symbol, prediction[0][1]  # Return symbol and confidence

# Initialize predictor globally
predictor = SignLanguagePredictor()

def decode_base64_image(base64_string):
    # Decode base64 string to image
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

@app.route('/predict', methods=['POST'])
def predict_sign():
    try:
        # Get image from request
        if 'image' not in request.files and 'image_base64' not in request.json:
            return jsonify({'error': 'No image provided'}), 400

        if 'image' in request.files:
            # Handle file upload
            file = request.files['image']
            npimg = np.fromfile(file, np.uint8)
            image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        else:
            # Handle base64 image
            image = decode_base64_image(request.json['image_base64'])

        if image is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # Get prediction
        symbol, confidence = predictor.predict(image)

        return jsonify({
            'predicted_symbol': symbol,
            'confidence': float(confidence)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7867, debug=True)