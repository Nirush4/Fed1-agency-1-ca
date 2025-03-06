const gridEl = document.querySelector('#js-grid');
const editBtn = document.getElementById('edit-btn');
const editSection = document.getElementById('edit-section');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const profileName = document.getElementById('profile-name');
const nameInput = document.getElementById('name-input');

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
    // NOTE: This is for the first time rendering the page
    renderGallery(imgList);
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      profileImg.src = savedImage;
    }
  }
}

export const imgList = [
  'https://plus.unsplash.com/premium_photo-1669725687221-6fe12c2da6b1?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1737396091041-158da644aee5?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1707814240518-b926061788bf?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1535748715526-1941af3fc315?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1604860428762-f55cea62b7a0?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1737562963380-3a7e45c0bf31?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1737625775722-9214c9cddf97?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1737625774333-60d9feaa4d2b?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1680995369588-502d70f0e3c8?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1674381523950-e63ad02ee451?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

renderGallery(imgList);

function renderImage(img) {
  const newImg = gritItemTemplate(img);
  const newImgEl = createHTML(newImg);
  gridEl.appendChild(newImgEl);
}

function renderGallery(list) {
  list.forEach(renderImage);
}

function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, 'text/html');
  return parsedDocument.body.firstChild;
}

function gritItemTemplate(url, altText = 'An image') {
  return `
    <div class="grid-item">
    <div class="img-div">
      <img
        src="${url}"
        alt="${altText}"
      />
    </div>
    </div>
  `;
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
  profileName.textContent = nameInput.value;
  editSection.classList.add('hidden');
  profileName.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  editSection.classList.add('hidden');
  profileName.classList.remove('hidden');
});
