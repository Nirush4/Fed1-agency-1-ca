const gridEl = document.querySelector('#js-grid');
const editBtn = document.getElementById('edit-btn');
const editSection = document.getElementById('edit-section');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const profileName = document.getElementById('profile-name');
const nameInput = document.getElementById('name-input');

const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

const key = import.meta.env.VITE_API_KEY;

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
    console.error('JS cannot run!!!');
  } else {
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
  const parsedDocument = parser.parseFromString(template, 'text/html');
  return parsedDocument.body.firstChild;
}

async function getImage() {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${encodeURIComponent(key)}&orientation=vertical&page=1&per_page=20&category=places`
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
    <div class="img-div">
     <a href="${detailsUrl}">
      <img
        src="${imgUrl}"
      />
    </a>
    </div>
 `;
}

async function createProductsListEl(list = []) {
  gridEl.innerHTML = '';

  try {
    list.forEach(({ id, largeImageURL }) => {
      const template = productTemplate({
        id: id,
        imgUrl: largeImageURL,
      });

      const newEl = createHTML(template);
      gridEl.append(newEl);
    });
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}
// Profile image upload by Nirushan

const fileInput = document.getElementById('file-input');
const profileImg = document.getElementById('profile-img');

// Stored profile picture in localStorage and display it
window.onload = function setImageInLS() {
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    profileImg.src = savedImage;
  }
};

fileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageSrc = e.target.result;
      profileImg.src = imageSrc;

      // Save the new image to localStorage
      localStorage.setItem('profileImage', imageSrc);
    };
    reader.readAsDataURL(file);
  }
});

// Profile name edit by Nirushan

editBtn.addEventListener('click', () => {
  editSection.classList.remove('hidden');
  profileName.classList.add('hidden');
  nameInput.value = profileName.textContent;
  nameInput.focus();
});

saveBtn.addEventListener('click', () => {
  const newName = nameInput.value;
  profileName.textContent = newName;
  localStorage.setItem('profileName', newName); // Store the new name in local storage
  editSection.classList.add('hidden');
  profileName.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  editSection.classList.add('hidden');
  profileName.classList.remove('hidden');
});

window.addEventListener('load', () => {
  const storedName = localStorage.getItem('profileName');
  if (storedName) {
    profileName.textContent = storedName;
  }
});
