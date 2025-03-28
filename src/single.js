const imgContainer = document.querySelector("#imgContainer");

const ERROR_MESSAGE_DEFAULT = 'Something went wrong';

async function fetchImgDetails() {
  const id = getId();

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
}


function detailsTemplate({ id, url, largeImageURL, likes, comments, views }) {

  return `
<div class="flex flex-col justify-between w-lg h-4/5 mx-auto bg-white rounded-t-lg shadow-lg">
    <div class="space-y-4 h-full p-6">
      <p class="text-gray-700 text-xl">Take me back</p>
      <a class="flex justify-center h-full" href="/single/index?id=${id}">
        <img src="${url || largeImageURL}" alt="Post Image" class="w-full h-full object-cover rounded-t-lg">
      </a>
    </div>
     <!-- Post Actions -->
    <div class="flex justify-between space-x-1 pt-1 border-t w-full bg-gray-200 px-7">

      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer"> &#x2665;&#xfe0f; ${likes} </button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer">💬 ${comments} </button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer">💬 ${views} </button>
      <button class="bg-gray-200 text-gray-800 text-xl py-2 px-3 rounded-md cursor-pointer">🔗 </button>

    </div>
</div>
  `;
}
 
/*async function renderImage() {
  const imgDetails = await fetchImageFromSources();
  if (imgDetails) {
    const template = detailsTemplate(imgDetails);
 
    const detailsEl = createHTML(template);
    clearNode();
    imgContainer.appendChild(detailsEl);
  } else {
    console.error("No image found from any source.");
  }
}*/

async function renderImgDetails() {
  const imgDetails = await fetchImgDetails();

  if (imgDetails) {
    const { id, largeImageURL, likes, views } = imgDetails;

    const template = detailsTemplate({
      id: id,
      largeImageURL: largeImageURL,
      likes,
      views,
    });

    const detailsEl = createHTML(template);
    clearNode();
    imgContainer.appendChild(detailsEl);
  }
}
renderImgDetails();

function clearNode() {
  imgContainer.innerHTML = "";
}
 
function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, 'text/html');
  return parsedDocument.body.firstChild;
}
 
//renderImage();


document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.querySelector('form');
  const commentsList = document.querySelector('.new-comments');

  let comments = JSON.parse(localStorage.getItem('comments') || '[]');

  function displayComments() {
    commentsList.innerHTML = comments
      .map(
        (comment, index) => `
            <div class=" rounded-lg p-3 shadow-sm relative group bg-gray-100">
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


renderImage();

document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.querySelector("form");
  const commentsList = document.querySelector(".new-comments");

  let comments = JSON.parse(localStorage.getItem("comments") || "[]");

  function displayComments() {
    commentsList.innerHTML = comments
      .map(
        (comment, index) => `
            <div class=" rounded-lg p-3 shadow-sm relative group bg-gray-100">
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
      .join("");
  }

  window.deleteComment = (index) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      comments.splice(index, 1);
      localStorage.setItem("comments", JSON.stringify(comments));
      displayComments();
    }
  };

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const commentInput = commentForm.querySelector("input");
    const commentText = commentInput.value.trim();

    if (commentText) {
      const newComment = {
        username: "User",
        text: commentText,
        timestamp: new Date().toLocaleString(),
      };

      comments.unshift(newComment);
      localStorage.setItem("comments", JSON.stringify(comments));

      commentInput.value = "";
      displayComments();
    }
  });


  displayComments();
});
