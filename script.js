const URL = "https://teachablemachine.withgoogle.com/models/RdvjUiPPf/";

let model, webcam, labelContainer, maxPredictions;

function startApp() {
    console.log("Starting app..."); // Debugging
    init();
}

// Load the image model and setup the webcam
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded, max predictions: ", maxPredictions); // Debugging

        // Set up webcam dimensions
        const flip = true; // whether to flip the webcam
        const webcamWidth = document.getElementById("webcam-container")?.offsetWidth;
        const webcamHeight = webcamWidth * (3 / 4);

        // Ensure webcam container exists before continuing
        if (!webcamWidth) {
            console.error("Webcam container not found.");
            return;
        }

        webcam = new tmImage.Webcam(webcamWidth, webcamHeight, flip); // width, height, flip
        webcam.canvas.style.width = "100%";
        webcam.canvas.style.height = "100%";
        webcam.canvas.style.objectFit = "cover";

        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Append elements to the DOM after setup
        const webcamContainer = document.getElementById("webcam-container");
        if (webcamContainer) {
            webcamContainer.appendChild(webcam.canvas);
        }

        // Initialize the label container
        labelContainer = document.getElementById("label-container");
        if (labelContainer) {
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }
            labelContainer.classList.add("show"); // Add the class after the label container is populated
        }

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
