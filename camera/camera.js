const cloudName = "du2edesv8";
const uploadPreset = "ml_default";

const recordBtn = document.querySelector("#main-video-button");
const captureBtn = document.getElementById("captureBtn");
const submitBtn = document.getElementById("submitBtn");
const video = document.querySelector("#main-video");
const mediaContainer = document.querySelector("#media-gallery-container");

const previewContainer = document.getElementById("previewContainer");

let mediaRecorder;
let recordedChunks = [];
let stream;
let fileToUpload = null; // Stores the latest media (image or video)

async function initialiser() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false, // Start with NO audio
    });

    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.error("Could not access camera:", err);
  }
}

recordBtn.addEventListener("click", async () => {
  if (recordBtn.textContent === "Record") {
    recordBtn.textContent = "Stop";
    await startRecording();
  } else {
    recordBtn.textContent = "Record";
    stopRecording();
  }
});

captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas size
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  // Draw video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to Blob (JPEG)
  canvas.toBlob((blob) => {
    if (blob) {
      fileToUpload = blob; // Store the captured image
      previewMedia("image", URL.createObjectURL(blob));
    }
  }, "image/jpeg");
});

// ✅ Show Preview
function previewMedia(type, src) {
  previewContainer.innerHTML = ""; // Clear previous preview

  if (type === "video") {
    const videoElement = document.createElement("video");
    videoElement.src = src;
    videoElement.controls = true;
    videoElement.width = 400;
    previewContainer.appendChild(videoElement);
  } else if (type === "image") {
    const imgElement = document.createElement("img");
    imgElement.src = src;
    imgElement.width = 400;
    previewContainer.appendChild(imgElement);
  }

  submitBtn.style.display = "block"; // Show submit button
}

// ✅ Upload on Submit Click
submitBtn.addEventListener("click", async () => {
  if (fileToUpload) {
    await uploadToCloudinary(fileToUpload);
    fileToUpload = null; // Reset after upload
    previewContainer.innerHTML = ""; // Clear preview
    submitBtn.style.display = "none"; // Hide submit button
  }
});

// ✅ Start Recording
async function startRecording() {
  recordedChunks = [];

  const audioStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const combinedStream = new MediaStream([
    ...stream.getVideoTracks(),
    ...audioStream.getAudioTracks(),
  ]);

  mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: "video/webm;codecs=vp9,opus",
  });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = async () => {
    const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
    fileToUpload = videoBlob; // Store recorded video
    previewMedia("video", URL.createObjectURL(videoBlob));
  };

  mediaRecorder.start();
}

// ✅ Stop Recording
function stopRecording() {
  mediaRecorder.stop();
}

// ✅ Upload to Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("tags", "myImages"); // ✅ Add tag for filtering

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Uploaded to Cloudinary:", data.secure_url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

initialiser();
