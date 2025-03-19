const imgContainer = document.querySelector('#img-container"');

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
    console.error('JS cannot run!!!');
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
  const parsedDocument = parser.parseFromString(template, 'text/html');
  return parsedDocument.body.firstChild;
}

async function getImage() {
  try {
    const response = await fetch(
      'https://v2.api.noroff.dev/social/posts',
      options
    );
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

async function fetchProductDetails(productId = '') {
  const Id = getId();

  try {
    if (!Id) {
      throw new Error('No product id was provided.');
    }

    const response = await fetch(`${API_URL}/${Id}`);
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}
// renderProductDetails();

function getId() {
  const parameterString = window.location.search;
  const searchParameters = new URLSearchParams(parameterString);
  const productId = searchParameters.get('id');

  return productId;
}

function detailsTemplate({
  id = '',
  primaryImgUrl = 'https://placehold.co/400x500',
  title = 'Unknown Product',
  price = 0,
  description = "This product doesn't have a description",
  alt = 'No Description present',
}) {
  const detailsUrl = `/jacket-specific.html?id=${id}`;
  return `
    <article class="product-details">
      <div class="product-images">
       <a href="${detailsUrl}">
        <img
          src="${primaryImgUrl}"
          alt="${alt}"
          class="main-image"
        />
      </a>
      </div>

      <div class="product-info">
        <h2 class="product-title">${title}</h2>
        <p class="product-price">${price} ${CURRENCY}</p>
        <p class="product-description">${description}</p>

        <form class="purchase-options" name="addToCartForm" id="js-product-cart-form" data-id="${id}">
          <input name="id" value="${id}" hidden/>
          <input name="imgUrl" value="${primaryImgUrl}" hidden/>
          <input name="price" value="${price}" hidden/>
          <input name="title" value="${title}" hidden/>

          <div class="form-group">
            <label for="size">Size:</label>
            <select id="size" name="size" class="select-size">
              <option value="s">Small</option>
              <option value="m">Medium</option>
              <option value="l">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              data-id="${id}"
              name="quantity"
              min="1"
              value="1"
              class="input-quantity"
            />
          </div>

          <button type="submit" data-id="${id}"class="add-to-cart">Add to Cart</button>
        </form>
      </div>
    </article>
  `;
}

async function renderProductDetails(productId) {
  const { image, title, price, description, id } =
    await fetchProductDetails(productId);

  const template = detailsTemplate({
    id,
    primaryImgUrl: image.url,
    alt: image.alt,
    title,
    price,
    description,
  });

  const detailsEl = createHTML(template);
  clearNode(containerEl);
  containerEl.appendChild(detailsEl);
  getCartSaleItemToLocalStorage();

  const form = document.querySelector('form[name="addToCartForm"]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productId = formData.get('id');
    const size = formData.get('size');
    const quantity = parseInt(formData.get('quantity'));

    addToCart(productId, quantity);
    addToCartHTML();
  });
}

function productTemplateOnSale({
  id,
  title = 'Unknown Item',
  imgUrl,
  imgAl,
  price = 0,
  discountedPrice = 0,
  description = 'Missing description',
  discountPercentage = 0,
  index,
}) {
  const detailsUrl = `/jacket-specific.html?id=${id}`;
  return `

  <article  aria-label="section-3">
            <div class="section-3-content-holder">

            <a href="${detailsUrl}" class="section-3-content-1">
                <div class="section-3-content-main-1"> 
                        <img src="${imgUrl}" alt="${imgAl}" >
                        <span class="discount-percentage">-${discountPercentage}%</span>
                      <div class="section-3-content-text-1">
                        <p class="section-3-content-item-name-1">${title}</p>
                             <div class="c-product-preview-rating">
                                  <span>&#9733;</span>
                                  <span>&#9733;</span>
                                  <span>&#9733;</span>
                                  <span>&#9733;</span>
                                  <span>&#9734;</span>
                                  <span class="reviews-2">(123 reviews)</span>
                              </div>
                            <div class="section-3-content-item-price-list-1">
                                <span class="section-3-content-item-price-new-1">${discountedPrice} ${CURRENCY}</span>
                                <span class="section-3-content-item-price-old-1">${price} ${CURRENCY}</span>
                            </div>
                        </div>

                  </div>
              </a>
                      <button class="c-add-to-cart-2" data-id="${id}" id="js-add-to-cart-${id}">Add to Cart</button>
             </div>
    </article>
 `;
}

function createproductTemplateOnSale(list = products) {
  clearNode(onSaleSection);

  list.forEach(({ id, title, image, price, description, discountedPrice }) => {
    const discountPercentage = ((price - discountedPrice) / price) * 100;
    const template = productTemplateOnSale({
      id,
      title,
      imgUrl: image.url,
      imgAl: image.alt,
      price,
      description,
      discountedPrice,
      discountPercentage: discountPercentage.toFixed(0),
    });

    const newElOnSale = createHTML(template);
    onSaleSection.append(newElOnSale);
  });
}

clearCartBtn.addEventListener('click', () => {
  let cart = JSON.parse(window.localStorage.getItem('Cart')) || [];
  window.localStorage.setItem('Cart', JSON.stringify((cart = [])));
  addToCartHTML();
});
