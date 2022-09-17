document.addEventListener("DOMContentLoaded", () => {
  const productId = sessionStorage.getItem("selectedProduct") ?? 50921; // Chevrolet Onix as default
  spinnerGetJSONData(PRODUCT_INFO_URL + productId + EXT_TYPE)
    .then(showProduct);

  spinnerGetJSONData(PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE)
    .then(showComments);
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
      `<div class="btn col py-1 px-0">
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

function showComments(comments) {
  const container = document.querySelector("#commentsContainer");

  if (comments.length != 0)
    for (const comment of comments) {
      const starRating = genStarRating(comment.score);

      container.innerHTML +=
        `<div class="row list-item shadow-sm mb-2">
          <div class="d-flex flex-row pt-1">
            <h5 class="pe-3"><strong>${comment.user}</strong></h5>
            <div id="starRating">${starRating}</div>
            <p class="text-muted ms-auto">${comment.dateTime}</p>
          </div>
        <p>${comment.description}</p>
        </div>`;
    }
  else
    container.innerHTML =
      `<div class="row">
        <h3 class="text-muted text-center">No hay comentarios para este producto.</h3>
      </div>`;
}

function genStarRating(score) {
  const full = Math.floor(score);

  let result = ""
  for(let i = 0; i < 5; i++) { // max stars = 5
    if (i < full) result += `<i class="fa fa-star checked"></i>`
    else          result += `<i class="fa fa-star"></i>`;
  }

  return result;
}
