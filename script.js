// Javascript Code

const URL = "https://teachablemachine.withgoogle.com/models/RdvjUiPPf/";

let model, webcam, labelContainer, maxPredictions;

function startApp() {
    const overlay = document.getElementById("webcam-overlay");
    overlay.style.display = "none";
    const startButton = document.getElementById("startButton")
    if (startButton) {
        startButton.style.display = "none";
    }

    console.log("Starting app..."); // Debugging
    init();
}

// Load the image model and setup the webcam
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded, max predictions: ", maxPredictions); // Debugging

        // Set up webcam dimensions
        const webcamContainer = document.getElementById("webcam-container");
        if (!webcamContainer) {
            console.error("Webcam container not found.");
            return;
        }
        
        const flip = true; // whether to flip the webcam
        const webcamWidth = webcamContainer.offsetWidth;
        const webcamHeight = webcamWidth * (3 / 4);

        // Create webcam object
        webcam = new tmImage.Webcam(webcamWidth, webcamHeight, flip); // width, height, flip
        console.log("Webcam object: ", webcam); // Debugging

        // Wait for webcam setup
        await webcam.setup(); // Request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Ensure the webcam canvas is correctly initialized
        console.log("Webcam canvas: ", webcam.canvas); // Debugging

        // Append webcam canvas to DOM
        webcamContainer.appendChild(webcam.canvas);

        // Initialize label container
        labelContainer = document.getElementById("label-container");
        if (!labelContainer) {
            console.error("Label container not found.");
            return;
        }

        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
        
        labelContainer.classList.add("show"); // Add the class after the label container is populated

    } catch (error) {
        console.error("Error during model setup: ", error);
    }
}

async function loop() {
    webcam.update(); // Update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    console.log("Predictions: ", prediction); // Debugging
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
