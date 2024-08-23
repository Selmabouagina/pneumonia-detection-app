const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 4000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to count files in a directory
function countFilesInDirectory(directoryPath) {
    return fs.readdirSync(directoryPath).length;
}

// Paths to the folders
const trainingNormalDir = path.join(__dirname, 'training/normal');
const trainingPneumoniaDir = path.join(__dirname, 'training/pneumonia');
const testingNormalDir = path.join(__dirname, 'testing/normal');
const testingPneumoniaDir = path.join(__dirname, 'testing/pneumonia');

// Count the images
const trainingNormalCount = countFilesInDirectory(trainingNormalDir);
const trainingPneumoniaCount = countFilesInDirectory(trainingPneumoniaDir);
const testingNormalCount = countFilesInDirectory(testingNormalDir);
const testingPneumoniaCount = countFilesInDirectory(testingPneumoniaDir);

// Serve static files (like images) from the 'public' directory
app.use(express.static('public'));

// Set up a route for the home page
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Pneumonia Detection App</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        padding: 20px;
                    }
                    h1 {
                        color: #007bff;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    h2 {
                        color: #0A13CB;
                    }
                    h3 {
                        color: #040A8E;
                    }
                    p {
                        font-size: 1.1em;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
                    .xray-images {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .xray-image {
                        margin: 15px;
                        text-align: center;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        transition: transform 0.3s, box-shadow 0.3s;
                    }
                    .xray-image:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    }
                    .xray-image img {
                        width: 200px;
                        border-radius: 10px 10px 0 0;
                    }
                    .xray-image p {
                        font-size: 1em;
                        color: #555;
                        padding: 10px;
                        background-color: #007bff;
                        color: #fff;
                        border-radius: 0 0 10px 10px;
                        margin: 0;
                    }
                    footer {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 0.9em;
                        color: #888;
                    }
                    footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    footer a:hover {
                        text-decoration: underline;
                    }
                        .chart-container {
                        width: 50%;
                        max-width: 500px;
                        margin: 40px auto;
                    }
                    canvas {
                        width: 100% !important;
                        height: auto !important;
                    }
                    .prediction-container {
                        text-align: center;
                        margin-top: 50px;
                    }
                    .prediction-container img {
                        max-width: 300px;
                        margin-top: 20px;
                    }
                    .uploaded-image img {
                        max-width: 300px;
                        margin-top: 20px;
                        transition: transform 0.3s ease-in-out;
                    }

                    .uploaded-image img:hover {
                        transform: scale(1.1);
                    }

                    button {
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }

                    button:hover {
                        background-color: #0056b3;
                    }

                    .result-box {
                        margin-top: 20px;
                        padding: 20px;
                        border-radius: 10px;
                        background-color: #f9f9f9;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        font-size: 1.2em;
                    }

                    .result-positive {
                        background-color: #d4edda;
                        color: #155724;
                    }

                    .result-negative {
                        background-color: #f8d7da;
                        color: #721c24;
                    }

                </style>
            </head>
            <body>
                <h1>Pneumonia</h1>
                <h2>Explanatory Content:</h2>
                <p>Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing symptoms such as a cough with phlegm or pus, fever, chills, and difficulty breathing.</p>
                <p><strong>Types of Pneumonia:</strong> Bacterial, Viral, and Fungal.</p>
                <p><strong>Symptoms:</strong> Cough, fever, shortness of breath, chest pain, and fatigue.</p>
                <p><strong>Risk Factors:</strong> Age, chronic diseases, weakened immune system, smoking.</p>
                <p><strong>Diagnosis:</strong> Physical examination, chest X-ray, blood tests, sputum test.</p>
                <p><strong>Treatment:</strong> Antibiotics, antiviral medications, rest, fluids, and in severe cases, hospitalization.</p>
                <p><strong>Prevention:</strong> Vaccination, good hygiene, avoiding smoking.</p>
                
                <h2 style="text-align:center; color: #007bff;">Example X-ray Images</h2>
                <div class="xray-images">
                    <div class="xray-image">
                        <img src="/images/normal.jpg" alt="Normal Lung X-ray">
                        <p>Normal Lung</p>
                    </div>
                    <div class="xray-image">
                        <img src="/images/mild.png" alt="Mild Pneumonia">
                        <p>Mild Pneumonia</p>
                    </div>
                    <div class="xray-image">
                        <img src="/images/moderate.png" alt="Moderate Pneumonia">
                        <p>Moderate Pneumonia</p>
                    </div>
                    <div class="xray-image">
                        <img src="/images/severe.jpeg" alt="Severe Pneumonia">
                        <p>Severe Pneumonia</p>
                    </div>
                </div>

                <!-- Divider for Smooth Transition -->
                <div class="divider"></div>

                <!-- Dataset Section -->
                <div class="dataset-section" id="dataset">
                    <h2>Dataset Statistics</h2>
                    <p>The dataset is organized into 3 folders (train, test, val) and contains subfolders for each image category (Pneumonia/Normal). There are 5,863 X-Ray images (JPEG) and 2 categories (Pneumonia/Normal). This dataset provides a comprehensive variety of cases, ensuring that the model learns to detect different types and severities of pneumonia.</p>
                    <p>Chest X-ray images (anterior-posterior) were selected from retrospective cohorts of pediatric patients of one to five years old from Guangzhou Women and Children’s Medical Center, Guangzhou. All chest X-ray imaging was performed as part of patients’ routine clinical care. </p>
                    <p> For the analysis of chest x-ray images, all chest radiographs were initially screened for quality control by removing all low quality or unreadable scans. The diagnoses for the images were then graded by two expert physicians before being cleared for training the AI system.</p>
                    <p>Below are the pie charts showing the distribution of images in the training and testing datasets.</p>

                    <h3>Training Data Distribution</h3>
                    <div class="chart-container">
                        <canvas id="trainingDistributionChart"></canvas>
                    </div>
                
                    <h3>Testing Data Distribution</h3>
                    <div class="chart-container">
                        <canvas id="testingDistributionChart"></canvas>
                    </div>
                    
                    <h2>Upload X-ray Image for Prediction</h2>
                    <div class="prediction-container">
                        <form id="uploadForm" enctype="multipart/form-data">
                            <input type="file" name="xrayImage" accept="image/*" required><br><br>
                            <button type="submit">Upload and Predict</button>
                        </form>
                        <div id="loadingSpinner" style="display: none;">
                            <img src="/images/loading.gif" alt="Loading...">
                        </div>
                        <div id="result"></div>
                        <div id="uploadedImage"></div>
                    </div>

                <script>
                    // Training Data Chart
                    const ctxTraining = document.getElementById('trainingDistributionChart').getContext('2d');
                    const trainingDistributionChart = new Chart(ctxTraining, {
                        type: 'pie',
                        data: {
                            labels: ['Normal', 'Pneumonia'],
                            datasets: [{
                                label: 'Training Data Distribution',
                                data: [${trainingNormalCount}, ${trainingPneumoniaCount}],
                                backgroundColor: ['#007bff', '#dc3545'],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                }
                            }
                        }
                    });

                    // Testing Data Chart
                    const ctxTesting = document.getElementById('testingDistributionChart').getContext('2d');
                    const testingDistributionChart = new Chart(ctxTesting, {
                        type: 'pie',
                        data: {
                            labels: ['Normal', 'Pneumonia'],
                            datasets: [{
                                label: 'Testing Data Distribution',
                                data: [${testingNormalCount}, ${testingPneumoniaCount}],
                                backgroundColor: ['#007bff', '#dc3545'],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                }
                            }
                        }
                    });

                    // Handle image upload and prediction
                    document.getElementById('uploadForm').addEventListener('submit', async function(e) {
                        e.preventDefault();
                        const formData = new FormData(this);
                        
                        // Show loading spinner
                        document.getElementById('loadingSpinner').style.display = 'block';
                        document.getElementById('result').style.display = 'none';

                        // Display the uploaded image
                        const imageFile = formData.get('xrayImage');
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.getElementById('uploadedImage').innerHTML = '<img src="' + e.target.result + '" alt="Uploaded X-ray Image">';
                        };
                        reader.readAsDataURL(imageFile);

                        try {
                            // Send the image for prediction
                            console.log('Sending image to Flask server...');
                            const response = await fetch('http://localhost:5001/predict', {
                                method: 'POST',
                                body: formData
                            });

                            // Log the response status
                            console.log('Response status:', response.status);
        
                            if (!response.ok) {
                                console.log('NO RESPONSE!!!!!');

                            }
        
                            const result = await response.json();

                            // Hide loading spinner
                            document.getElementById('loadingSpinner').style.display = 'none';

                            console.log('Prediction result:', result);

                            // Display the result
                            const resultBox = document.getElementById('result');
                            resultBox.style.display = 'block';

                            if (result.prediction === 'Pneumonia') {
                                resultBox.className = 'result-box result-positive';
                                resultBox.innerHTML = 'Prediction: Pneumonia';
                            } else {
                                resultBox.className = 'result-box result-negative';
                                resultBox.innerHTML = 'Prediction: Normal';
                            }


                        } catch (error) {
                            document.getElementById('result').innerText = 'Error: ' + error.message;
                            console.log(error.message)
                        }

                    });
                </script>

                </div>

                <footer>
                    <p>&copy; 2024 Pneumonia Detection App. <a href="/resnet">Learn more about our models</a>.</p>
                </footer>

            </body>
        </html>
    `);
});

app.get('/resnet', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>ResNet Model - Pneumonia Detection App</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        color: #333;
                        padding: 20px;
                    }
                    h1 {
                        color: #007bff;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    h3 {
                        color: #040A8E;
                    }
                    p {
                        font-size: 1.1em;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
                    ul {
                        margin-left: 20px;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 0 auto;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>ResNet Model</h1>
                <p>ResNet (Residual Network) is a deep neural network architecture that was introduced by Kaiming He et al. in their 2015 paper, "Deep Residual Learning for Image Recognition". It won the 1st place in the ILSVRC 2015 classification competition.</p>
                <p>ResNet allows us to train very deep neural networks without facing the problem of vanishing/exploding gradients by introducing shortcut connections, or "residuals". This is done by using identity mappings, which skip one or more layers.</p>
                <h3>Key Features of ResNet:</h3>
                <ul>
                    <li><strong>Identity Shortcuts:</strong> These are skip connections that help bypass certain layers, allowing gradients to flow directly through the network during backpropagation, which eases the training of deep networks.</li>
                    <li><strong>Residual Blocks:</strong> ResNet consists of residual blocks, where the output of a layer is added to the input of the block. This simple addition helps mitigate the vanishing gradient problem and allows for the training of deeper networks.</li>
                    <li><strong>Multiple Variants:</strong> ResNet has several variants such as ResNet-18, ResNet-34, ResNet-50, ResNet-101, and ResNet-152, where the number indicates the depth of the network (i.e., the number of layers).</li>
                    <li><strong>High Accuracy:</strong> ResNet achieves high accuracy on image recognition tasks, making it a popular choice for computer vision applications, including medical image analysis.</li>
                </ul>

                <h3>Residual Blocks:</h3>
                The core idea behind ResNet is the use of residual blocks, which incorporate a technique called skip connections. In a traditional neural network, each layer receives the output of the previous layer, transforms it, and passes it to the next layer. However, as networks get deeper, the transformations can become so complex that the network struggles to learn effectively.
                
                To mitigate this, ResNet introduces a skip connection that bypasses one or more layers and directly connects the input of a block to its output. This effectively creates a shortcut that allows the model to learn residual mappings—hence the name "Residual Network."
                <ul>
                    <li>Skip Connection: The skip connection allows the network to pass the input directly to a later layer, bypassing the intermediate layers. This helps prevent the degradation of information as it passes through many layers, making the network easier to train.</li>
                    <li>Residual Mapping: Instead of trying to learn the direct mapping H(x) (from input x to output), the network learns the residual mapping F(x):=H(x)−x. The output is then the sum of this residual mapping and the original input: H(x):=F(x)+x. This makes it easier for the network to adjust the output and improves learning.
                </ul>

                <h3>Why is this important?</h3>
                Without skip connections, the deeper layers might contribute very little or nothing useful to the learning process, especially in deep networks. The skip connections ensure that information from earlier layers is preserved and that the network can continue to improve its accuracy even as it gets deeper. This design allows ResNet to train much deeper networks—hundreds or even thousands of layers—without suffering from the vanishing/exploding gradient problem.

                <h3>Applications and Impact:</h3>
                ResNet has been instrumental in advancing the field of deep learning, particularly in image recognition tasks. It has been used to win several image recognition competitions, including the ImageNet challenge, and is widely adopted in various domains, including medical imaging, autonomous vehicles, and more.

                <h2>ResNet Architecture:</h2>
                <img src="/images/resnet_architecture.png" alt="ResNet Architecture">

                <p><a href="/">Back to Home</a></p>
            </body>
        </html>
    `);
});


// Start the server
app.listen(port, () => {
    console.log(`Pneumonia Detection App listening at http://localhost:${port}`);
});