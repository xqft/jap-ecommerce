export async function getCart() {
  const localCart = JSON.parse(window.localStorage.getItem("cart-products") ?? "[]");

  if (localCart.length === 0) {
    const remoteCart  = await spinnerGetJSONData(CART_INFO_URL + "25801" + EXT_TYPE);
    const newCart     = remoteCart.articles;

    setLocalCart(newCart);
    return newCart;
  } else return localCart;
}

export function setLocalCart(data) {
  window.localStorage.setItem("cart-products", JSON.stringify(data));
}

export function setCartItemCount(id, count) {
  const cart = JSON.parse(window.localStorage.getItem("cart-products") ?? "[]");

  if (cart.length === 0) {
    throw "Local cart is empty when it shouldn't.";
  }

  cart[cart.findIndex(item => item.id === id)].count = count;
  setLocalCart(cart);
}
