const imgContainer = document.querySelector('#img-container'); // Update this selector to match your HTML

const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

const key = import.meta.env.VITE_API_KEY;

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

function detailsTemplate({ id, largeImageURL }) {
  const detailsUrl = `/single/index?id=${id}`;
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
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg py-2 px-3 rounded-md focus:outline-none">Like</button>
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg py-2 px-3 rounded-md focus:outline-none">Comment</button>
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg py-2 px-3 rounded-md focus:outline-none">Share</button>
    </div>
</div>

  `;
}

async function renderImgDetails() {
  const imgDetails = await fetchImgDetails();

  if (imgDetails) {
    const { id, largeImageURL } = imgDetails;

    const template = detailsTemplate({
      id: id,
      largeImageURL: largeImageURL,
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
