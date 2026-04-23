import {
  cart,
  removeCartItem,
  calculateCartQuantity,
  updateDeliveryOption,
  findProductInCart,
  updateProductQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";
import {
  deliveryOptions,
  findDeliveryOption,
} from "../data/deliveryOptions.js";
import daysjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import renderPaymentSummary from "./paymentSummary.js";

export default function renderCheckoutSummary() {
  let checkoutProductsHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let productsInCart = findProductInCart(productId);

    const deliveryOptionId = cartItem.deliveryOptionsId;
    let deliveryOption = findDeliveryOption(deliveryOptionId);

    const today = daysjs();

    const deliveryDate = today
      .add(deliveryOption.deliveryDays, "days")
      .format("dddd, MMMM D");

    checkoutProductsHTML += `
   <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: ${deliveryDate}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${productsInCart.image}">

        <div class="cart-item-details">
          <div class="product-name">
           ${productsInCart.name}
          </div>
          <div class="product-price">
            ${productsInCart.getProductPrice()}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.productQuantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id=${cartItem.productId}>
              Update
            </span>
            <input class="quantity-input" type="number">
            <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id=${cartItem.productId}>Save</span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id=${cartItem.productId}>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(productsInCart, cartItem)}
        </div>
      </div>
    </div>
`;
  });

  function deliveryOptionsHTML(productsInCart, cartItem) {
    let deliveryOptionsHTML = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = daysjs();

      const deliveryDate = today
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMMM D");

      const deliveryPrice =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatMoney(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

      deliveryOptionsHTML += `
      <div class="delivery-option js-delivery-option" 
        data-product-id="${productsInCart.id}" 
        data-delivery-options-id="${deliveryOption.id}">
        <input type="radio" class="delivery-option-input"
          name="delivery-option-${productsInCart.id}"
          ${isChecked ? "checked" : ""}>
        <div>
          <div class="delivery-option-date">
            ${deliveryDate}
          </div>
          <div class="delivery-option-price">
            ${deliveryPrice} Shipping
          </div>
        </div>
      </div>
      `;
    });

    return deliveryOptionsHTML;
  }

  document.querySelector(".js-order-summary").innerHTML = checkoutProductsHTML;

  document
    .querySelectorAll(".js-delete-quantity-link")
    .forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        const productId = deleteButton.dataset.productId;
        removeCartItem(productId);
        updateCartQuantity();
        // document.querySelector(`.js-cart-item-container-${productId}`).remove();
        renderCheckoutSummary();
        renderPaymentSummary();
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

  document
    .querySelectorAll(".js-update-quantity-link")
    .forEach((updateButton) => {
      updateButton.addEventListener("click", () => {
        const { productId } = updateButton.dataset;
        document
          .querySelector(`.js-cart-item-container-${productId}`)
          .classList.add("is-editing-quantity");
      });
    });

  document.querySelectorAll(".js-save-quantity-link").forEach((saveButton) => {
    saveButton.addEventListener("click", () => {
      const { productId } = saveButton.dataset;
      document
        .querySelector(`.js-cart-item-container-${productId}`)
        .classList.remove("is-editing-quantity");

      const newQuantity = document.querySelector(".quantity-input").value;
      updateProductQuantity(productId, newQuantity);
      renderCheckoutSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((deliveryOption) => {
    deliveryOption.addEventListener("click", () => {
      const { productId, deliveryOptionsId } = deliveryOption.dataset;
      updateDeliveryOption(productId, deliveryOptionsId);
      renderCheckoutSummary();
      renderPaymentSummary();
    });
  });
}
