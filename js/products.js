window.addEventListener("DOMContentLoaded", () => {
  const categoryId = localStorage.getItem("catID") || 101; // default category is "autos"

  spinnerGetJSONData(PRODUCTS_URL + categoryId + EXT_TYPE)
    .then(category => {
      document.querySelector("#categoryNameTitle").innerHTML = category.catName;
      updateProductCount(category.products.length);

      showProductList(category.products);

      handleProductsFiltering(category.products);
  }).catch(err => {
      document.querySelector("#productList").innerHTML =
        `<div class="container">
          <div class="alert alert-danger text-center" role="alert">
          <h4 class="alert-heading">${err}</h4>
          </div>
        </div>`;
  });
});

function handleProductsFiltering(products) {
  const priceFilterForm = document.querySelector("#priceFilterForm");
  const searchFilterFormInput = document.querySelector("#searchFilterForm input");
  const buttonCleanFilter = document.querySelector("#btnCleanFilter");

  let priceFilteredProducts = products;
  let finalProducts = products;

  const updateList = () => {
    showProductList(finalProducts);
    updateProductCount(finalProducts.length);
  }

  priceFilterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const prices = validatePriceFilterInputs(priceFilterForm);
    priceFilteredProducts = filterByPrice(prices, products);
    finalProducts = filterByText(searchFilterFormInput.value, priceFilteredProducts);
    updateList();
  });
  
  searchFilterFormInput.addEventListener('input', () => {
    finalProducts = filterByText(searchFilterFormInput.value, priceFilteredProducts);
    updateList();
  })

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
  document.querySelector("#productListContent").innerHTML = listHTML;
}
