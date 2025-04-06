const imgContainerEl = document.querySelector('#img-container');

const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

setup();

async function setup() {
  if (!imgContainerEl) {
    console.error('JS cannot run!!!');
  } else {
    const imgList = await getImage();
    const videoList = await getVideo();

    const combinedList = [...imgList, ...videoList];
    const sortCombinedList = combinedList.sort(
      (a, b) => a.downloads - b.downloads
    );
    createProductsListEl(sortCombinedList);
  }
}

async function getImage() {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=49423799-7939ddd154968d7fb42d51820&orientation=vertical&safesearch=true&image_type=photo&page=2&per_page=100&category=music`
    );

    const { hits } = await response.json();

    return hits || [];
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
    return [];
  }
}

async function getVideo() {
  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=49423799-7939ddd154968d7fb42d51820&orientation=vertical&safesearch=true&page=3&per_page=20&category=music`
    );

    const { hits } = await response.json();
    return hits || [];
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
    return [];
  }
}

function productTemplate({ id, imgUrl, videoUrl }) {
  const detailsUrl = `/single/index?id=${id}`;

  const isImageValid =
    imgUrl && (imgUrl.endsWith('.jpg') || imgUrl.endsWith('.jpeg'));

  return `
    <div class="grid-item">
      <div class="">
        <!-- If there is a video URL, show the video, otherwise show the image (if valid) -->
        ${
          videoUrl
            ? `
            <div class="post-div">
                 <a href="${detailsUrl}">
                   <video controls autoplay muted class="video-content w-full h-130 object-cover">
                     <source src="${videoUrl}" type="video/mp4">
                   </video>
                 </a>
            </div>
             `
            : isImageValid
              ? `
            <div class="post-div">
                   <a href="${detailsUrl}">
                     <img src="${imgUrl}" class="video-content w-full h-130 object-cover"/>
                   </a>
            </div>
            `
              : ''
        }
      </div>
    </div>
  `;
}

async function createProductsListEl(list = []) {
  imgContainerEl.innerHTML = '';

  try {
    if (Array.isArray(list)) {
      list.forEach(({ id, largeImageURL, videos }) => {
        const videoUrl = videos?.tiny?.url || null;

        if (!videoUrl) {
          console.warn('No valid video URL found for ID:', id);
        }

        const template = productTemplate({
          id: id,
          imgUrl: largeImageURL,
          videoUrl: videoUrl,
        });

        const newEl = createHTML(template);
        imgContainerEl.append(newEl);
      });
    } else {
      console.error('Expected an array, but received:', list);
    }
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

export function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, 'text/html');
  return parsedDocument.body.firstChild;
}
