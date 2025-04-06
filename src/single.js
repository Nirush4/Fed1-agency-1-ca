const imgContainer = document.querySelector('#img-container');

function getImageArrayFromLS() {
  localStorage.getItem('compainedImg');
}

getImageArrayFromLS();

async function fetchImageFromSources() {
  const id = getId();

  if (!id) {
    console.error('No product id was provided.');
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
    console.error('Cloudinary fetch failed:', error.message);
  }

  try {
    const pixabayResponse = await fetch(
      `https://pixabay.com/api/?key=49423799-7939ddd154968d7fb42d51820&id=${id}`
    );

    if (!pixabayResponse.ok) {
      throw new Error('Failed to fetch Pixabay image');
    }

    const { hits } = await pixabayResponse.json();

    if (hits.length === 0) {
      throw new Error('No image found on Pixabay');
    }
    return hits[0];
  } catch (error) {
    console.error('Pixabay fetch failed:', error.message);
  }

  try {
    const pixabayResponseVideo = await fetch(
      `https://pixabay.com/api/videos/?key=49423799-7939ddd154968d7fb42d51820&id=${id}`
    );

    if (!pixabayResponseVideo.ok) {
      throw new Error('Failed to fetch Pixabay video');
    }

    const { hits } = await pixabayResponseVideo.json();

    if (hits.length === 0) {
      throw new Error('No video found on Pixabay');
    }
    return hits[0];
  } catch (error) {
    console.error('Pixabay video fetch failed:', error.message);
    return null;
  }
}

function getId() {
  return new URLSearchParams(window.location.search).get('id');
}

function createSkeletonLoader() {
  return `
    <div class="skeleton-loader-single main-div flex flex-col justify-between mx-auto mt-7 bg-white rounded-t-lg shadow-lg">
      <div class="skeleton-single">
        <div class="skeleton-image-single"></div>
      </div> 
    </div>
  `;
}

createSkeletonListEl();

function createSkeletonListEl() {
  imgContainer.innerHTML = '';

  const skeletonHTML = createSkeletonLoader();

  imgContainer.innerHTML = skeletonHTML;
}

function detailsTemplate({
  id,
  url,
  largeImageURL,
  likes,
  tags = 'Photo from camera',
  views = 53,
  videos,
}) {
  const videoUrl = videos?.tiny?.url || null;

  const isVideo =
    videoUrl?.match(/\.(mp4|webm|ogg|film)$/) ||
    url?.match(/\.(mp4|webm|ogg|film)$/);

  return `
<div class="main-div flex flex-col justify-between w-xs mx-auto mt-7 bg-white rounded-t-lg shadow-lg md:w-lg lg:w-xl">
  <div class="space-y-4 p-4 h-145 md:p-6 md:h-150 lg:h-180">
    <div class="flex justify-between mb-0 items-center md:mb-3"> 
      <p class="text-gray-700 text-lg lg:text-xl">Collecting moments,📸 not things.</p>
      <button id="deleteBtn" class="cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-black" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <a class="flex justify-center h-full" href="/single/index?id=${id}">
      ${
        isVideo
          ? `<video controls class="w-full h-full object-cover rounded-t-lg">
               <source src="${videoUrl || url}" type="video/mp4">
               Your browser does not support the video tag.
             </video>`
          : `<img src="${url || largeImageURL}" alt="${tags}" class="w-full h-full object-cover rounded-t-lg">`
      }
    </a>
  </div>
  <!-- Post Actions -->
  <div class="flex justify-between space-x-1 pt-1 border-t w-full bg-gray-200 px-7 z-10">
    <button class="main-likes text-gray-800 text-xl py-2 px-3 rounded-md focus:outline-none cursor-pointer">
      <i class="fa-regular fa-heart likes-icon"></i> <span class="likes-count text-lg lg:text-xl">${likes}</span>
    </button>
    <button class="text-gray-800 py-2 px-3 rounded-md focus:outline-none cursor-pointer text-lg lg:text-xl"> &#x1F441; ${views}</button>
  </div>
</div>

  `;
}

function extractBlob(url) {
  const match = url.match(/blob_([a-zA-Z0-9]+)/);
  return match ? match[0] : null;
}

async function renderImage() {
  const imgDetails = await fetchImageFromSources();

  if (imgDetails) {
    const template = detailsTemplate(imgDetails);

    const detailsEl = createHTML(template);
    clearNode();
    imgContainer.appendChild(detailsEl);

    const likeIcon = document.querySelector('.likes-icon');
    const likesCountElement = document.querySelector('.likes-count');

    let imgLikes = await fetchImageFromSources();
    const imageId = imgLikes.id;
    let currentLikes = imgLikes.likes || 15;

    if (localStorage.getItem(imageId)) {
      currentLikes = parseInt(localStorage.getItem(imageId), 10);
    } else {
      localStorage.setItem(imageId, currentLikes);
    }

    likesCountElement.textContent = currentLikes;

    let isLiked = false;

    likeIcon.addEventListener('click', () => {
      if (isLiked) {
        currentLikes -= 1;
      } else {
        currentLikes += 1;
      }

      likesCountElement.textContent = currentLikes;

      likeIcon.classList.toggle('fa-regular');
      likeIcon.classList.toggle('fa-solid');

      likeIcon.style.color = isLiked ? '' : 'red';

      localStorage.setItem(imageId, currentLikes);

      isLiked = !isLiked;
    });

    const deleteBtn = document.querySelector('#deleteBtn');
    deleteBtn.addEventListener('click', deleteImage);
  } else {
    console.error('No image found from any source.');
  }
}

function clearNode() {
  imgContainer.innerHTML = '';
}

function createHTML(template) {
  return new DOMParser().parseFromString(template, 'text/html').body.firstChild;
}

renderImage();

document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.querySelector('form');
  const commentsList = document.querySelector('.new-comments');

  let comments = JSON.parse(localStorage.getItem('comments') || '[]');

  function displayComments() {
    commentsList.innerHTML = comments
      .map(
        (comment, index) => `
            <div class=" rounded-lg p-3 shadow-sm relative group">
                <div class="flex items-center gap-2 mb-1">
                    <img src="/images/default-profile-pic.png" alt="user avatar" class="w-8 h-8 rounded-full">
                    <span class="font-medium text-gray-500">${comment.username}</span>
                    <span class="text-gray-500 text-sm">${comment.timestamp}</span>
                </div>
                <p class="text-gray-700">${comment.text}</p>
                <!-- Delete Button - Only visible on hover -->
                <button
                    onclick="deleteComment(${index})"
                    class="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                    title="Delete comment">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `
      )
      .join('');
  }

  window.deleteComment = (index) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      comments.splice(index, 1);
      localStorage.setItem('comments', JSON.stringify(comments));
      displayComments();
    }
  };

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentInput = commentForm.querySelector('input');
    const commentText = commentInput.value.trim();

    if (commentText) {
      const newComment = {
        username: 'User',
        text: commentText,
        timestamp: new Date().toLocaleString(),
      };

      comments.unshift(newComment);
      localStorage.setItem('comments', JSON.stringify(comments));

      commentInput.value = '';
      displayComments();
    }
  });

  displayComments();
});

function deleteImage() {
  const Id = getId();

  let images = JSON.parse(localStorage.getItem('combinedImg'));

  if (!images) {
    images = JSON.parse(localStorage.getItem('compainedImg')) || [];
  }

  const index = images.findIndex((img, i) => {
    if (typeof img === 'object' && img.id) {
      return String(img.id) === String(Id);
    }
    return extractBlob(img) === Id;
  });

  if (index !== -1) {
    images.splice(index, 1);

    localStorage.setItem('combinedImg', JSON.stringify(images));
  } else {
    console.warn('No matching image found for deletion!');
  }

  window.location.href = '/profile/index.html';
}
