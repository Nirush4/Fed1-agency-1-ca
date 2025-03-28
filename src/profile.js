const gridEl = document.querySelector("#js-grid");
const editBtn = document.getElementById("edit-btn");
const editSection = document.getElementById("edit-section");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const profileName = document.getElementById("profile-name");
const nameInput = document.getElementById("name-input");
const mediaContainer = document.querySelector("#media-gallery-container");


const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

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
    const imgFromCloud = await loadImages();

    const imgList = await getImage();

    const compainedImg = [...imgList, ...imgFromCloud];

    const shuffledArray = compainedImg.sort(() => Math.random() - 0.5);

    createProductsListEl(shuffledArray);


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
      `https://pixabay.com/api/?key=49423799-7939ddd154968d7fb42d51820&orientation=vertical&page=1&per_page=20&category=places`
    );

    const { hits } = await response.json();

    return hits;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}
function productTemplate({ id, imgUrl }) {
  const detailsUrl = `/single/index?id=${id}`;

  return `
    <div class="grid-item">
      <div class="post-div">
        <a href="${detailsUrl}">
          <img src="${imgUrl}" />
        </a>
      </div>
    </div>
  `;
}

async function createProductsListEl(list = []) {
  gridEl.innerHTML = "";

  try {
    list.forEach((item) => {
      let imgUrl;

      let Id = '';
      if (typeof item === 'string') {

        imgUrl = item;
      } else if (item.largeImageURL) {
        imgUrl = item.largeImageURL;
      }

      const match = imgUrl.match(/blob_[a-zA-Z0-9]+/);
      if (match) {
        Id = match[0];
      }

      if (imgUrl) {
        const template = productTemplate({
          id: item.id || Id,
          imgUrl: imgUrl,
        });

        const newEl = createHTML(template);


        const image = newEl.querySelector('img');

        if (image && Id) {
          image.id = Id;
        }
        gridEl.append(newEl);
      }
    });
  } catch (error) {
    console.error('Error creating product list:', error?.message);
  }
}

const fileInput = document.getElementById("file-input");
const profileImg = document.getElementById("profile-img");

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

      localStorage.setItem("profileImage", imageSrc);
    };
    reader.readAsDataURL(file);
  }
});

editBtn.addEventListener("click", () => {
  editSection.classList.remove("hidden");
  profileName.classList.add("hidden");
  nameInput.value = profileName.textContent;
  nameInput.focus();
});

saveBtn.addEventListener("click", () => {
  const newName = nameInput.value;
  profileName.textContent = newName;
  localStorage.setItem("profileName", newName);
  editSection.classList.add("hidden");
  profileName.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  editSection.classList.add("hidden");
  profileName.classList.remove("hidden");
});

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


  videoProps: { controls: 'all', autoplay: false },

  mediaAssets: [
    {
      tag: "myImages",
      transformation: {
        prefixed: false,
        quality: 'auto:best',
        width: 800,
        height: 600,
        fetch_format: 'auto',

        x_0: 1,
        crop: "fill",
      },
    },
  ],
});

myGallery.render();

let listOfImgs = [];

function loadImages() {
  return new Promise((resolve, reject) => {
    var interval = setInterval(function () {
      if (document.readyState === 'complete') {
        const images = mediaContainer.querySelectorAll('img');
        const arrImg = Array.from(images);

        if (!arrImg.length || arrImg[0].src.length <= 1) {
          console.warn('No images found yet. Waiting...');
          return;
        }

        const filterImgs = arrImg.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.src === value.src)
        );

        listOfImgs = filterImgs.map((i) => i.src);

        mediaContainer.innerHTML = '';

        clearInterval(interval);
        resolve(listOfImgs);
      }
    }, 2500);
  });
}

loadImages()
  .then((images) => {
    console.log('Images are ready:', images);
  })
  .catch((error) => {
    console.error('Error loading images:', error);
  });
