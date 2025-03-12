// import { Cloudinary } from "@cloudinary/url-gen";

// // Import required actions.
// import { sepia } from "@cloudinary/url-gen/actions/effect";

// // Create and configure your Cloudinary instance.
// const cld = new Cloudinary({
//   cloud: {
//     cloudName: "demo",
//   },
// });

// Instantiate a CloudinaryImage object for the image with public ID, 'front_face'.
// const myImage = cld.image("front_face");

// Perform the transformation.
// myImage.effect(sepia()); // Apply a sepia effect.

// Render the image in an 'img' element.
// const imgElement = document.createElement("img");
// imgElement.src = myImage.toURL();

document.getElementById("app").innerHTML = `
<div>
<button id="upload_widget">Upload files</>
</div>`;

var myCropWidget = cloudinary.createUploadWidget(
  {
    cloudName: "du2edesv8",
    uploadPreset: "ml_default",
  },
  (error, result) => {
    console.log(error, "blabla", result);
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",
  function () {
    myCropWidget.open();
  },
  false
);
