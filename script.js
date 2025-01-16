// Javascript Code

const URL = "https://teachablemachine.withgoogle.com/models/RdvjUiPPf/";

let model, webcam, labelContainer, maxPredictions;

function startApp() {
    // Hide start button
    const overlay = document.getElementById("webcam-overlay");
    overlay.style.display = "none";

    // Show label container
    labelContainer.classList.add("show");

    console.log("Starting app..."); // Debugging

    // Initialize
    init();
}

// Load the image model and setup the webcam
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
    
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded, max predictions: ", maxPredictions); // Debugging
    
        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        const webcamWidth = document.getElementById("webcam-container").offsetWidth
        const webcamHeight = webcamWidth * (3 / 4);
    
        webcam = new tmImage.Webcam(webcamWidth, webcamHeight, flip); // width, height, flip
        webcam.canvas.style.width = "100%";
        webcam.canvas.style.height = "100%";
        webcam.canvas.style.objectFit = "cover";
    
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);
    
        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (error) {
            console.error("Error during model setup: ", error);
        }
} 

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
     window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    console.log("Predictions: ", prediction); // Debugging
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
