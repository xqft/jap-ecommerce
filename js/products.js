window.addEventListener("DOMContentLoaded", () => {
  const categoryId = localStorage.getItem("catID") || 101; // default category is "autos"

  spinnerGetJSONData(PRODUCTS_URL + categoryId + EXT_TYPE)
    .then(category => {
      document.querySelector("#categoryNameTitle").innerHTML = category.catName;
      updateProductCount(category.products.length);

      showProductList(category.products);

      handleProducts(category.products);
  }).catch(err => {
      document.querySelector("#productList").innerHTML =
        `<div class="container">
          <div class="alert alert-danger text-center" role="alert">
          <h4 class="alert-heading">${err}</h4>
          </div>
        </div>`;
  });
});

function handleProducts(products) {
  const priceFilterForm = document.querySelector("#priceFilterForm");
  const searchFilterFormInput = document.querySelector("#searchFilterForm input");
  const buttonCleanFilter = document.querySelector("#btnCleanFilter");

  let priceFilteredProducts = products;
  let finalProducts = products;
  let orderingCriteria = "relev";

  const updateList = () => {
    finalProducts = orderProducts(finalProducts, orderingCriteria);
    showProductList(finalProducts);
    updateProductCount(finalProducts.length);
  }

  // The list gets filtered by price and by text
  priceFilterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const prices = validatePriceFilterInputs(priceFilterForm);
    priceFilteredProducts = filterByPrice(prices, products);

    finalProducts = filterByText(searchFilterFormInput.value, priceFilteredProducts);
    updateList();
  });
  
  // The list only gets filtered by text
  searchFilterFormInput.addEventListener('input', () => {
    finalProducts = filterByText(searchFilterFormInput.value, priceFilteredProducts);
    updateList();
  })

  for (const id of ["price-asc", "price-desc", "relev"])
    document.querySelector("#" + id).addEventListener("click", () => {
      orderingCriteria = id; 
      updateList();
      // Every button id matches its criteria
    })

  // The price filtering inputs are cleaned
  buttonCleanFilter.addEventListener('click', (event) => {
    event.preventDefault();

    priceFilteredProducts = products;
    for (const input of priceFilterForm.querySelectorAll("input")) {
      input.value = "";
      input.classList.remove("is-invalid");
    }
    finalProducts = filterByText(searchFilterFormInput.value, priceFilteredProducts);
    updateList();
  })
}

function orderProducts(products, criteria) {
  switch (criteria) {
    case "price-asc":   return products.sort((a, b) => a.cost - b.cost);
    case "price-desc":  return products.sort((a, b) => b.cost - a.cost);
    case "relev":       return products.sort((a, b) => b.soldCount - a.soldCount);
  }
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
  if (prices) {
    const { minPrice, maxPrice } = prices;
    return products.filter(product =>
      minPrice <= product.cost && product.cost <= maxPrice);
  }
}

function filterByText(input, products) {
  const tokens = input.toLowerCase().split(" ");
  if (input) return products.filter(product => {
    for (const token of tokens)
      if (product.name.toLowerCase().includes(token) || 
        product.description.toLowerCase().includes(token))
        return true;
  });
  else return products;
}

function updateProductCount(productCount) {
  document.querySelector("#productCount").innerHTML = productCount;
  for (const charNode of document.querySelectorAll("#productList .plural-chars"))
    if (productCount === 1) charNode.classList.add("d-none") // hide characters
    else charNode.classList.remove("d-none");
}

function showProductList(products) {
  let listHTML = "";
  for (const product of products) {
    listHTML +=
      `<a href=# class="list-group-item list-group-item-action card mb-3 mx-0 p-0 shadow-sm rounded bg-white">
        <div class="row g-0">
          <div class="col-md-4 col-xl-3 col-5 p-0 d-flex flex-wrap align-items-center">
            <img class="img-fluid" src="${product.image}" alt="imagen de ${product.name}">
          </div>
          <div class="col d-flex flex-row align-items-center">
            <div class="card-body p-1 ps-3">
              <h2 class="card-title">${product.name}</h2>
              <p class="card-text">${product.description}</p>
              <div class="container p-0 mt-auto d-flex flex-row justify-content-between">
                <h3 class="card-text">${product.currency} ${product.cost}</h3>
                <p class="card-text text-end text-secondary small">${product.soldCount} vendidos.</p> 
              </div>
            </div>
          </div>
          <div class="col-sm-auto align-self-end">
          </div>
        </div>
      </a>`;
  }
  document.querySelector("#productListContent").innerHTML = listHTML;
}
