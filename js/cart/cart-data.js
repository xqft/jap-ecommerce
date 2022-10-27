export async function getCart() {
  const localCart   = JSON.parse(window.localStorage.getItem("cart-products") ?? "[]");
  const remoteCart  = await spinnerGetJSONData(CART_INFO_URL + "25801" + EXT_TYPE);

  if (localCart.length === 0) {
    const newCart = remoteCart.articles.concat(localCart);

    setLocalCart(newCart);
    return newCart;
  } else return localCart;
}

export function setLocalCart(data) {
  window.localStorage.setItem("cart-products", JSON.stringify(data));
}
