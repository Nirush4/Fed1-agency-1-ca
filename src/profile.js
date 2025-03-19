const gridEl = document.querySelector("#js-grid");
const editBtn = document.getElementById("edit-btn");
const editSection = document.getElementById("edit-section");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const profileName = document.getElementById("profile-name");
const nameInput = document.getElementById("name-input");

const mediaContainer = document.querySelector("#media-gallery-container");
const cloudinaryGalleryContainer = document.querySelector(".cld-gallery"); // Ensure this is correct

const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

const options = {
  method: 'GET',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmlydXNoIiwiZW1haWwiOiJuaXJyYWowMzMyN0BzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTc0MTAwNzAzOH0.e3eJ9TupVI7RCcQsg5Y2ATY3YQ-k0-ac3rT4G_V9BWI',
    'X-Noroff-API-Key': 'f9c959e7-bfef-453f-a521-ec2ce2545f87',
  },
};

setup();

async function setup() {
  if (
    !gridEl ||
    !editBtn ||
    !editSection ||
    !saveBtn ||
    !cancelBtn ||
    !profileName ||
    !nameInput
  ) {
    console.error("JS cannot run!!!");
  } else {
    // NOTE: This is for the first time rendering the page

    // renderGallery(imgList);
    const imgList = await getImage();
    createProductsListEl(imgList);
    const savedImage = localStorage.getItem('profileImage');

    if (savedImage) {
      profileImg.src = savedImage;
    }
  }
}


function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}


async function getImage() {
  try {
    const response = await fetch(
      'https://v2.api.noroff.dev/social/posts',
      options
    );
    const { data } = await response.json();
    return data
      .filter(
        (post) =>
          post.media && Object.prototype.hasOwnProperty.call(post.media, 'url')
      )
      .map((post) => ({
        id: post.id,
        image: post.media.url,
      }));
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function productTemplate({ imgUrl }) {
  // const detailsUrl = `/single/index?id=${id}`;

  return `
  
  <div class="grid-item">
    <div class="img-div">
      <img
        src="${imgUrl}"
      />
    </div>

 `;
}

async function createProductsListEl(list = []) {
  gridEl.innerHTML = '';

  try {
    list.forEach(({ id, image }) => {
      const template = productTemplate({
        id,
        imgUrl: image,
      });
      const newEl = createHTML(template);
      gridEl.append(newEl);
    });
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}
// Profile image upload by Nirushan

const fileInput = document.getElementById("file-input");
const profileImg = document.getElementById("profile-img");

// Stored profile picture in localStorage and display it
window.onload = function setImageInLS() {
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    profileImg.src = savedImage;
  }
};

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageSrc = e.target.result;
      profileImg.src = imageSrc;

      // Save the new image to localStorage
      localStorage.setItem("profileImage", imageSrc);
    };
    reader.readAsDataURL(file);
  }
});

// Profile name edit by Nirushan

editBtn.addEventListener("click", () => {
  editSection.classList.remove("hidden");
  profileName.classList.add("hidden");
  nameInput.value = profileName.textContent;
  nameInput.focus();
});

saveBtn.addEventListener("click", () => {
  const newName = nameInput.value;
  profileName.textContent = newName;
  localStorage.setItem("profileName", newName); // Store the new name in local storage
  editSection.classList.add("hidden");
  profileName.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  editSection.classList.add("hidden");
  profileName.classList.remove("hidden");
});

// On page load, if there's a saved name in local storage, use it
window.addEventListener("load", () => {
  const storedName = localStorage.getItem("profileName");
  if (storedName) {
    profileName.textContent = storedName;
  }
});


const myGallery = cloudinary.galleryWidget({
  container: mediaContainer,
  cloudName: "du2edesv8",
  carouselStyle: "none",
  autoplay: false,
  videoProps: { controls: "all", autoplay: false },
  displayProps: {
    mode: "expanded",
    columns: 3,
  },
  mediaAssets: [
    {
      tag: "myImages",
      transformation: {
        quality: "auto:best",
        fetch_format: "auto",
        x_0: 1,
        crop: "fill",
      },
    },
  ],
});

myGallery.render();

var interval = setInterval(function () {
  if (document.readyState === "complete") {
    const images = mediaContainer.querySelectorAll("img");
    const arrImg = Array.from(images);

    // ✅ Fix: Don't reload the page, just wait for images
    if (!arrImg.length || arrImg[0].src.length <= 1) {
      console.warn("No images found yet. Waiting...");
      return; // Wait instead of reloading
    }

    // ✅ Remove duplicate images
    const filterImgs = arrImg.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.src === value.src)
    );

    const listOfImgs = filterImgs.map((i) => i.src);

    mediaContainer.innerHTML = "";

    // ✅ Wrap each image in a div with class "grid-div"
    listOfImgs.forEach((src) => {
      const gridDiv = document.createElement("div");
      gridDiv.classList.add("grid-item");

      const wrapperDiv = document.createElement("div");
      wrapperDiv.classList.add("img-div");

      const imgEl = document.createElement("img");
      imgEl.classList.add("image-scale");
      imgEl.src = src;

      wrapperDiv.appendChild(imgEl);
      gridDiv.appendChild(wrapperDiv);
      gridEl.appendChild(gridDiv);
    });

    clearInterval(interval); // ✅ Stop interval after images are loaded
  }
}, 100);

// ✅ Stop after 5 seconds to prevent infinite execution
setTimeout(() => {
  clearInterval(interval);
  console.log("Interval stopped after 5 seconds.");
}, 50000);

