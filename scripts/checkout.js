import { cart, removeCartItem, calculateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";

let checkoutProductsHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let productsInCart;
  products.forEach((product) => {
    if (productId === product.id) {
      productsInCart = product;
    }
  });
  checkoutProductsHTML += `
   <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: Wednesday, June 15
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${productsInCart.image}">

        <div class="cart-item-details">
          <div class="product-name">
           ${productsInCart.name}
          </div>
          <div class="product-price">
            $${formatMoney(productsInCart.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.productQuantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id=${cartItem.productId}>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${productsInCart.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input"
              name="delivery-option-${productsInCart.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${productsInCart.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
`;
});

document.querySelector(".order-summary").innerHTML = checkoutProductsHTML;

document
  .querySelectorAll(".js-delete-quantity-link")
  .forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const productId = deleteButton.dataset.productId;
      removeCartItem(productId);
      updateCartQuantity();
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
    });
  });

updateCartQuantity();

function updateCartQuantity() {
  let cartQuantity = calculateCartQuantity();
  if (cartQuantity >= 0 && cartQuantity <= 1) {
    document.querySelector(".js-return-to-home-link").innerHTML =
      `${cartQuantity} item`;
  } else {
    document.querySelector(".js-return-to-home-link").innerHTML =
      `${cartQuantity} items`;
  }
}
