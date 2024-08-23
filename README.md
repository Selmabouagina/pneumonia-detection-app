# X-ray Pneumonia Detection Web App

This web application allows users to upload chest X-ray images and receive predictions for pneumonia using a pre-trained deep learning model.

## Features

- **Image Upload:** Users can upload X-ray images directly through the web interface.
- **Prediction Display:** The app processes the uploaded image and displays a prediction result indicating either "Pneumonia" or "Normal."
- **ResNet Model Information:** A dedicated page that explains the ResNet architecture, its benefits, and how it works, accessible through the footer link.
- **Interactive Interface:** The prediction result is presented in a visually engaging way, centered within the page for ease of viewing.

## Pre-trained Model

The application relies on a pre-trained model file (`model.h5`) for making predictions. To obtain this model:

1. Download the Jupyter notebook "Pneumonia with X-ray images.ipynb" from the repository.
2. Run the notebook to generate and save the model as `model.h5`.
3. Place the `model.h5` file in the root directory of the web app folder.

## X-ray Dataset

For displaying dataset statistics (e.g., training and testing data distribution charts), you need to download the X-ray images from Kaggle:

1. Download the chest X-ray images dataset from [Kaggle](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia).
2. Extract the dataset and place the `train` and `test` folders within the web app folder in their respective directories.

## How to Use

1. Place the `model.h5` file in the root directory of the web app folder.
2. Place the `train` and `test` folders inside the web app folder as instructed.
3. Run the application, and upload a chest X-ray image to get a prediction.
