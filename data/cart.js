import { products } from "../data/products.js";

export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingProductItem;

  const selectedQuantity = document.querySelector(
    `.js-quantity-selector-${productId}`,
  ).value;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingProductItem = cartItem;
    }
  });

  if (matchingProductItem) {
    matchingProductItem.productQuantity += Number(selectedQuantity);
  } else {
    cart.push({
      productId,
      productQuantity: Number(selectedQuantity),
      deliveryOptionsId: "1",
    });
  }

  updateLocalStorage();
}

export function removeCartItem(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  updateLocalStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.productQuantity;
  });
  return cartQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionsId) {
  let matchingProductItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingProductItem = cartItem;
    }
  });
  matchingProductItem.deliveryOptionsId = deliveryOptionsId;
  updateLocalStorage();
}

export function findProductInCart(productId) {
  let productsInCart;
  products.forEach((product) => {
    if (productId === product.id) {
      productsInCart = product;
    }
  });
  return productsInCart;
}
