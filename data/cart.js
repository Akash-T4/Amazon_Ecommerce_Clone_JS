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
