import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";

let productHTML = "";

products.forEach((product) => {
  productHTML += ` 
  <div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
     ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
          ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${formatMoney(product.priceCents)}
    </div>

    <div class="product-quantity-container">
      <select class="js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart-${product.id}">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>
  `;
});

document.querySelector(".products-grid").innerHTML = productHTML;

document.querySelectorAll(".js-add-to-cart-button").forEach((button) => {
  button.addEventListener("click", () => {
    const { productId } = button.dataset;
    addToCart(productId);
    updateCartQuantity();
    addedToCartDom(productId);
  });
});

updateCartQuantity();

function updateCartQuantity() {
  let cartQuantity = calculateCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

function addedToCartDom(productId) {
  let timeoutId = {};

  document
    .querySelector(`.js-added-to-cart-${productId}`)
    .classList.add("js-added-cart");

  const previousAddToCartTimeoutId = timeoutId[productId];

  if (previousAddToCartTimeoutId) {
    clearTimeout(previousAddToCartTimeoutId);
  }

  const addToCartTimeoutId = setTimeout(() => {
    document
      .querySelector(`.js-added-to-cart-${productId}`)
      .classList.remove("js-added-cart");
  }, 2000);

  timeoutId[productId] = addToCartTimeoutId;
}
