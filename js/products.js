window.addEventListener("DOMContentLoaded", () => {
	const categoryId = localStorage.getItem("catID") || 101; // default category is "autos"

	spinnerGetJSONData(PRODUCTS_URL + categoryId + EXT_TYPE)
		.then(category => {
			document.querySelector("#productListHeader").innerHTML = buildProductListHeaderHTML(category);
			document.querySelector("#productListContent").innerHTML = buildProductListHTML(category.products);

			handlePriceFiltering(category.products);
	}).catch(err => {
		productList.innerHTML =
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
			document.querySelector("#productListContent").innerHTML = buildProductListHTML(filteredProducts);
			document.querySelector("#productCount").innerHTML = filteredProducts.length;
		}
	});

	document.querySelector("#btnCleanFilter").addEventListener('click', () => {
		document.querySelector("#productListContent").innerHTML = buildProductListHTML(products);
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

	// visual feedback
	if (minPrice > maxPrice) {
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

function buildProductListHeaderHTML(category, productCount) {
	return `<div class="row px-3 px-sm-0 text-left">
			<div class="display-1">${category.catName}</div>
			<div class="lead">Se han encontrado <strong id="productCount">${productCount}</strong> productos:</div>
		</div>
		<div class="row my-2">
			<div class="col-5 col-xxl-8"></div>
			<form class="col-md-7 col-xxl-4" id="filterForm">
				<div class="row">
					<div class="col input-group needs-validation">
						<span class="input-group-text">$</span>
						<input type="number" class="form-control" name="minPrice" min="0" placeholder="min" oninput="
						this.value = this.value >= 0 ? this.value : null">
						<input type="number" class="form-control" name="maxPrice" min="0" placeholder="max" oninput="
						this.value = this.value >= 0 ? this.value : null">
						<!-- https://stackoverflow.com/questions/7372067/is-there-any-way-to-prevent-input-type-number-getting-negative-values -->
						<div class="invalid-feedback">Por favor ingrese precios válidos.</div>
					</div>
					<div class="col-auto">
						<button class="btn btn-primary" type="submit">Filtrar</button>
						<button class="btn btn-outline-danger" id="btnCleanFilter">Limpiar</button>
					</div>
				</div>
			</form>
		</div>`;
}

function buildProductListHTML(products) {
	let result = "";
	for (const product of products) {
		result +=
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
	return result;
}
