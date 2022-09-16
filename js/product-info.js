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
  // Each element's name matches the product object property.

  const imgContainer = document.querySelector("#productImages")
  imgContainer.classList.add("row-cols-" + product.images.length);
  document.querySelector("#mainImage").setAttribute("src", product.images[0]);

  for (const img of product.images) {
    const id = product.images.indexOf(img);
    imgContainer.innerHTML +=
      `<div class="btn col p-1">
      <input type="radio" class="btn-check" id="thumb-${id}" name="thumbimg" autocomplete="off" checked="">
        <label class="btn p-0" for="thumb-${id}">
          <img class="img-fluid" src="${img}" alt="${product.name}">
        </label>
      </div>`;
  }

  // FIXME: This should be inside the previous for..of, it didn't work properly
  // when I tried and I don't have time to keep trying.
  document.querySelectorAll("input").forEach(elem => elem.addEventListener("click", () => {
    const index = elem.getAttribute("id").slice("thumb-".length);
    document.querySelector("#mainImage").setAttribute("src", product.images[index]);
    }));
}
