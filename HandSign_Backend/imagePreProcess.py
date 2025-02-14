from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64

app = Flask(__name__)

def decode_base64_image(base64_string):
    # Decode base64 string to image
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 2)
    th3 = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    ret, res = cv2.threshold(th3, 70, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    resized_image = cv2.resize(res, (128, 128))
    return resized_image

@app.route('/preprocess', methods=['POST'])
def preprocess():
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
        
        preprocessed_image = preprocess_image(image)
        _, buffer = cv2.imencode('.png', preprocessed_image)
        preprocessed_image_base64 = base64.b64encode(buffer).decode('utf-8')
        return jsonify({'preprocessed_image': preprocessed_image_base64})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)