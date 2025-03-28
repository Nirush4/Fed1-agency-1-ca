const imgContainer = document.querySelector("#imgContainer");

async function fetchImageFromSources() {
  const id = getId();
  debugger;
  if (!id) {
    console.error("No product id was provided.");
    return null;
  }

  try {
    const cloudinaryResponse = await fetch(
      `https://res.cloudinary.com/du2edesv8/image/upload/h_600,w_800/${id}`
    );

    if (cloudinaryResponse.ok) {
      return { id, url: cloudinaryResponse.url };
    }
  } catch (error) {
    console.error("Cloudinary fetch failed:", error.message);
  }

  try {
    const pixabayResponse = await fetch(
      `https://pixabay.com/api/?key=49423799-7939ddd154968d7fb42d51820&orientation=vertical&page=1&per_page=20&category=places&id=${id}`
    );

    if (!pixabayResponse.ok) {
      throw new Error("Failed to fetch Pixabay image");
    }

    const { hits } = await pixabayResponse.json();

    if (hits.length === 0) {
      throw new Error("No image found on Pixabay");
    }
    return hits[0];
  } catch (error) {
    console.error("Pixabay fetch failed:", error.message);
    return null;
  }
}

function getId() {
  return new URLSearchParams(window.location.search).get("id");
  debugger;
}

function detailsTemplate({ id, url, largeImageURL, likes, comments }) {
  return `
<div class="flex flex-col justify-between w-lg h-4/5 mx-auto bg-white rounded-t-lg shadow-lg">
    <div class="space-y-4 h-full p-6">
      <p class="text-gray-700 text-xl">Take me back</p>
      <a class="flex justify-center h-full" href="/single/index?id=${id}">
        <img src="${url || largeImageURL}" alt="Post Image" class="w-full h-full object-cover rounded-t-lg">
      </a>
    </div>
    <div class="flex justify-between space-x-1 pt-1 border-t w-full bg-gray-200 px-7">
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer"> &#x2665;&#xfe0f; ${likes} </button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer">💬 ${comments} </button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer">🔗 </button>
    </div>
</div>
  `;
}

async function renderImage() {
  const imgDetails = await fetchImageFromSources();
  if (imgDetails) {
    const template = detailsTemplate(imgDetails);

    const detailsEl = createHTML(template);
    clearNode();
    imgContainer.appendChild(detailsEl);
  } else {
    console.error("No image found from any source.");
  }
}

function clearNode() {
  imgContainer.innerHTML = "";
}

function createHTML(template) {
  return new DOMParser().parseFromString(template, "text/html").body.firstChild;
}

renderImage();
