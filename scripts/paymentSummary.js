import { cart, findProductInCart } from "../data/cart.js";
import { findDeliveryOption } from "../data/deliveryOptions.js";
import { formatMoney } from "./utils/money.js";

export default function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let productQuantity = 0;
  cart.forEach((cartItem) => {
    const product = findProductInCart(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.productQuantity;
    productQuantity += cartItem.productQuantity;
    const deliveryOption = findDeliveryOption(cartItem.deliveryOptionsId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforetaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforetaxCents * 0.1;
  const totalCents = totalBeforetaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${productQuantity}):</div>
      <div class="payment-summary-money">$${formatMoney(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatMoney(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatMoney(totalBeforetaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatMoney(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatMoney(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}
