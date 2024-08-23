from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
model = tf.keras.models.load_model('model.h5')

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if 'xrayImage' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['xrayImage']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    print(file.filename)
    # Preprocess the image
    img = Image.open(io.BytesIO(file.read())).convert('RGB')
    img = img.resize((224, 224))  # Resize to the input size expected by your model
    img_array = image.img_to_array(img)  # Convert the image to a numpy array
    img_array = np.expand_dims(img_array, axis=0)  # Add an extra dimension for batch size
    img_array = img_array / 255.0  # Normalize the image

    # Make prediction
    prediction = model.predict(img_array)
    class_index = prediction[0]

    if class_index > 0.5:
        result = 'Pneumonia'
    else:
        result = 'Normal'

    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(port=5001)
