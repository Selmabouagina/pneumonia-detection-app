# X-ray Pneumonia Detection Web App

This web application allows users to upload chest X-ray images and receive predictions for pneumonia using a pre-trained deep learning model.

## Features

- **Image Upload:** Users can upload X-ray images directly through the web interface.
- **Prediction Display:** The app processes the uploaded image and displays a prediction result indicating either "Pneumonia" or "Normal."
- **ResNet Model Information:** A dedicated page that explains the ResNet architecture, its benefits, and how it works, accessible through the footer link.
- **Interactive Interface:** The prediction result is presented in a visually engaging way, centered within the page for ease of viewing.

## Requirements

- **Python**: Version 3.9.13
- **TensorFlow**: Version 2.11.0
- **Flask**: Required for the Python API
- **Node.js**: Required for the server-side application
- **Additional Node.js packages**:
  - `express`
  - `multer`
  - `axios`

## Pre-trained Model and Dataset

Due to GitHub's file size limitations, the pre-trained model file (`model.h5`) is not included in this repository. However, you can download it by following these steps:

1. **Download the Pre-trained Model:**
   - Use the Jupyter notebook `Pneumonia with X-ray images.ipynb` provided in the repository to download the pre-trained model (`model.h5`).
   - Place the `model.h5` file in the root directory of the web app folder.

2. **Download the X-ray Dataset:**
   - Download the training and testing X-ray images folders from [Kaggle](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia).
   - Place the `train` and `test` folders inside the web app folder to display charts.

## Flask API

A Flask API is used in this web app to handle the prediction logic. Flask was chosen because it provides a simple yet powerful way to create APIs that can be easily integrated with other frameworks like Node.js. The Flask API receives the uploaded X-ray image, processes it, and returns the prediction result, which is then displayed in the web app.

## Running the Web App

To run the web app, follow these steps:

1. **Start the Flask API:**
   - Navigate to the folder containing the Flask script.
   - Run the script using `python model_server.py`.

2. **Start the Node.js server:**
   - Navigate to the folder containing the Node.js script.
   - Run the server using `node index.js`.

3. **Open your browser and navigate to `http://localhost:4000`.**
