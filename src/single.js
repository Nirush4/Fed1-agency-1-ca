const imgContainer = document.querySelector('#img-container');
const mediaContainer = document.querySelector('#media-gallery-container');

const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

const imgFromCloud = await loadImages();

const imgList = await fetchImgDetails();

const compainedImg = [...imgList, ...imgFromCloud];

function texting(compainedImg) {
  return compainedImg;
}

async function fetchImgDetails() {
  const id = getId();
  if (!id) {
    throw new Error('No product id was provided.');
  }
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=49423799-7939ddd154968d7fb42d51820&orientation=vertical&page=1&per_page=20&category=places&id=${id}`
    );

    const { hits } = await response.json();

    if (hits.length === 0) {
      throw new Error('No image found');
    }
    return hits[0];
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function getId() {
  const parameterString = window.location.search;
  const searchParameters = new URLSearchParams(parameterString);
  const imageId = searchParameters.get('id');
  return imageId;
}

function detailsTemplate({ id, largeImageURL, likes, comments, datasetId }) {
  const detailsUrl = `/single/index?id=${id}&datasetId=${datasetId || ''}`;
  return `
<div class=" flex flex-col justify-between w-lg h-4/5 mx-auto bg-white rounded-t-lg shadow-lg">
  
    <!-- Post Content -->
    <div class="space-y-4 h-full p-6">
      <p class="text-gray-700 text-xl">Take me back</p>
      <a class="flex justify-center h-full" href="${detailsUrl}">
        <img src="${largeImageURL}" alt="Post Image" class="w-full h-full object-cover rounded-t-lg">
      </a>
    </div>

    <!-- Post Actions -->
    <div class="flex justify-between space-x-1 pt-1 border-t w-full bg-gray-200 px-7">
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md focus:outline-none cursor-pointer"> &#x2665;&#xfe0f; ${likes}</button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md focus:outline-none cursor-pointer">💬 ${comments}</button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md focus:outline-none cursor-pointer">🔗 </button>
    </div>
</div>

  `;
}

async function renderImgDetails() {
  const imgDetails = texting();

  if (imgDetails) {
    const { id, largeImageURL, likes, comments, datasetId } = imgDetails;

    const template = detailsTemplate({
      id: id,
      largeImageURL: largeImageURL,
      likes,
      comments,
      datasetId: datasetId,
    });

    const detailsEl = createHTML(template);
    clearNode();
    imgContainer.appendChild(detailsEl);
  }
}

renderImgDetails();

function clearNode() {
  imgContainer.innerHTML = '';
}

function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, 'text/html');
  return parsedDocument.body.firstChild;
}

const myGallery = cloudinary.galleryWidget({
  container: mediaContainer,
  cloudName: 'du2edesv8',
  carouselStyle: 'none',
  autoplay: false,

  videoProps: { controls: 'all', autoplay: false },

  mediaAssets: [
    {
      tag: 'myImages',
      transformation: {
        prefixed: false,
        quality: 'auto:best',
        width: 800,
        height: 600,
        fetch_format: 'auto',

        x_0: 1,
        crop: 'fill',
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
