const cloudName = "du2edesv8";
const uploadPreset = "ml_default";

const recordBtn = document.querySelector("#main-video-button");
const captureBtn = document.getElementById("captureBtn");
const submitBtn = document.getElementById("submitBtn");
const video = document.querySelector("#main-video");

const previewContainer = document.getElementById("previewContainer");

const blurBtn = document.querySelector("#blur-btn");
const brigtnessBtn = document.querySelector("#brightness-btn");
const invertBtn = document.querySelector("#invert-btn");

const openCameraBtn = document.getElementById("open-camera");

invertBtn.addEventListener("click", () => {
  if (video.style.filter === "invert(75%)") {
    video.style.filter = "none";
  } else {
    video.style.filter = "invert(75%)";
  }
});

blurBtn.addEventListener("click", () => {
  if (video.style.filter === "blur(2px)") {
    video.style.filter = "none";
  } else {
    video.style.filter = "blur(2px)";
  }
});

brigtnessBtn.addEventListener("click", () => {
  if (video.style.filter === "grayscale(100%)") {
    video.style.filter = "none";
  } else {
    video.style.filter = "grayscale(100%)";
  }
});

let mediaRecorder;
let recordedChunks = [];
let stream;
let fileToUpload = null;

async function initialiser() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
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
    video.style.display = "none";
    stopRecording();
  }
});

const imageContainer = document.getElementById("video-canvas");

captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  openCameraBtn.style.display = "block";

  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  context.filter = video.style.filter;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  video.style.display = "none";
  canvas.style.display = "block";

  canvas.toBlob((blob) => {
    if (blob) {
      fileToUpload = blob;
      previewMedia("image", URL.createObjectURL(blob));
    }
  }, "image/jpeg");
});

openCameraBtn.addEventListener("click", () => {
  video.style.display = "block";
  openCameraBtn.style.display = "none";
  previewContainer.remove();
});

function previewMedia(type, src) {
  previewContainer.innerHTML = "";

  if (type === "video") {
    const videoElement = document.createElement("video");
    videoElement.src = src;
    videoElement.controls = true;
    videoElement.width = 400;

    previewContainer.appendChild(videoElement);
    imageContainer.appendChild(previewContainer);
  } else if (type === "image") {
    const imgElement = document.createElement("img");
    imgElement.id = "test";
    imgElement.src = src;
    imgElement.width = 400;

    previewContainer.appendChild(imgElement);
    imageContainer.appendChild(previewContainer);
  }

  submitBtn.style.display = "block";
}

submitBtn.addEventListener("click", async () => {
  if (fileToUpload) {
    await uploadToCloudinary(fileToUpload);
    fileToUpload = null;
    previewContainer.innerHTML = "";
    submitBtn.style.display = "none";
  }
});

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
    fileToUpload = videoBlob;
    previewMedia("video", URL.createObjectURL(videoBlob));
  };

  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  formData.append("tags", "myImages");

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
