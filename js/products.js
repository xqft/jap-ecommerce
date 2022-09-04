window.addEventListener("DOMContentLoaded", () => {
  const categoryId = localStorage.getItem("catID") || 101; // default category is "autos"

  spinnerGetJSONData(PRODUCTS_URL + categoryId + EXT_TYPE)
    .then(category => {
      showProductList(category.products);
      updateProductListHeader(category.catName, category.products.length);

      handlePriceFiltering(category.products);
  }).catch(err => {
      document.querySelector("#productListHeader").innerHTML =
        `<div class="container">
          <div class="alert alert-danger text-center" role="alert">
          <h4 class="alert-heading">${err}</h4>
          </div>
        </div>`;
  });
});

function handlePriceFiltering(products) {
  document.querySelector("#filterForm").addEventListener('submit', (event) => {
    event.preventDefault();

    const prices = validatePriceFilterInputs(event.target); // returns null if invalid
    if (prices) {
      const filteredProducts = filterByPrice(prices, products);
      showProductList(filteredProducts);
      updateProductListHeader(null, filteredProducts.length);
    }
  });

  document.querySelector("#btnCleanFilter").addEventListener('click', () => {
    showProductList(products);
    updateProductListHeader(null, products.length);
    for (const input of document.querySelectorAll("#filterForm input"))
      input.value = "";
  })
}

function validatePriceFilterInputs(form) {
  let { minPrice, maxPrice } = Object.fromEntries((new FormData(form)).entries());
  minPrice = parseInt(minPrice, 10) || 0;
  maxPrice = parseInt(maxPrice, 10) || Infinity;

  const forEachInput = (action) => {
    for (input of form.querySelectorAll(".input-group input"))
      action(input);
  }

  if (minPrice > maxPrice) {
    // visual feedback
    forEachInput(input => input.classList.add("is-invalid"));
    return null;
  } else {
    forEachInput(input => input.classList.remove("is-invalid"));
    return { minPrice, maxPrice };
  }
}

function filterByPrice(prices, products) {
  const { minPrice, maxPrice } = prices;
  return products.filter(product =>
    minPrice <= product.cost && product.cost <= maxPrice);
}

function updateProductListHeader(categoryName, productCount) {
  if (categoryName) document.querySelector("#categoryNameTitle").innerHTML = categoryName;
  if (productCount) document.querySelector("#productCount").innerHTML = productCount;
  for (const charNode of document.querySelectorAll("#productListHeader .plural-chars"))
    if (productCount <= 1) charNode.classList.add("d-none") // hide characters
    else charNode.classList.add("d-none");
}

function showProductList(products) {
  let listHTML = "";
  for (const product of products) {
    listHTML +=
      `<div class="row mb-3 mx-0 shadow-sm rounded bg-white">
        <div class="container p-0 d-flex justify-content-between">
          <div class="col-md-3 col-xl-2 col-5 p-0 d-flex align-items-center">
            <img class="img-fluid" src="${product.image}" alt="imagen de ${product.name}">
          </div>
          <div class="col mx-2 d-flex flex-column">
              <h2>${product.name}</h2>
              <p>${product.description}</p>
              <div class="container p-0 mt-auto d-flex flex-row justify-content-between">
                <h3>${product.currency} ${product.cost}</h3>
                <p class="text-end text-secondary small">${product.soldCount} vendidos.</p> 
              </div>
          </div>
          <div class="col-sm-auto align-self-end">
          </div>
        </div>
      </div>`;
  }
  document.querySelector("#productList").innerHTML = listHTML;
}
