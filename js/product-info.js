document.addEventListener("DOMContentLoaded", () => {
  const productId = sessionStorage.getItem("selectedProduct") ?? 50921; // Chevrolet Onix as default
  spinnerGetJSONData(PRODUCT_INFO_URL + productId + EXT_TYPE)
    .then(product => {
      showProduct(product);
    });
});

function showProduct(product) {
  for (const element of document.querySelectorAll(".productInfo"))
    element.innerHTML = product[element.getAttribute("name")];

  const imagesDiv = document.querySelector("#productImages")
  imagesDiv.classList.add("row-cols-" + product.images.length);

  for (const img of product.images) {
    const element = document.createElement("img");

    element.setAttribute("src", img);
    element.setAttribute("alt", product.name);
    element.classList.add("img-fluid", "col", "p-1")

    imagesDiv.appendChild(element);
    //TODO: addeventlistener for click event
  }
}
