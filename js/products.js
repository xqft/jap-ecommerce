window.addEventListener("DOMContentLoaded", () => {
	const productListHeaderNode	= document.querySelector("#productListHeader");	
	const productListContentNode = document.querySelector("#productListContent");	
	let categoryId = localStorage.getItem("catID");
	if (categoryId === null) categoryId = "101";
	
	let category = {};
	let products = [];

	// TODO: Rewrite getJSONData() as I don't find it well designed
	getJSONData(PRODUCTS_URL + categoryId + EXT_TYPE).then(({data, status}) => {
		if (status === "ok") {
			category = data;
			products = data.products;
			productListHeaderNode.innerHTML = buildProductListHeaderHTML(category, products.length)
			productListContentNode.innerHTML = buildProductListHTML(products);
		}
		else
			productListHeaderNode.innerHTML =
				`<div class="container">
					<div class="alert alert-danger text-center" role="alert">
					<h4 class="alert-heading">${data}</h4>
					</div>
				</div>`;
	});

	document.querySelector("#filterForm").addEventListener('submit', (event) => {
		event.preventDefault();
		handlePriceFiltering(event.target, products, productListContentNode);
	});

	document.querySelector("#btnCleanFilter").addEventListener('click', () => {
		productListContentNode.innerHTML = buildProductListHTML(products);
		for (const input of document.querySelectorAll("#filterForm input"))
			input.value = "";
	})
});

function handlePriceFiltering(priceFilterForm, products, productListContentNode) {
	let data = Object.fromEntries((new FormData(priceFilterForm)).entries());

	// data validation:
	data.minPrice = parseInt(data.minPrice, 10) || 0;
	data.maxPrice = parseInt(data.maxPrice, 10) || Number.MAX_SAFE_INTEGER;
	// if parseInt returns NaN, a falsy value, then || will return the 
	// right-hand side operand (this is a way of setting default values).

	const filteredProducts = products.filter(product =>
		data.minPrice <= product.cost && product.cost <= data.maxPrice);

	productListContentNode.innerHTML = buildProductListHTML(filteredProducts);
	document.querySelector("#productCount").innerHTML = filteredProducts.length;
}

function buildProductListHeaderHTML(category, productCount) {
	return `<div class="row px-3 px-sm-0 text-left">
			<div class="display-1">${category.catName}</div>
			<div class="lead">Se han encontrado <strong id="productCount">${productCount}</strong> productos:</div>
		</div>
		<div class="row">
			<div class="col-5 col-xxl-8"></div>
			<form class="col-md-7 col-xxl-4" id="filterForm">
				<div class="row">
					<div class="col input-group">
						<span class="input-group-text">$</span>
						<input type="number" class="form-control" name="minPrice" min="0" placeholder="min" oninput="
						this.value = this.value >= 0 ? this.value : null">
						<input type="number" class="form-control" name="maxPrice" min="0" placeholder="max" oninput="
						this.value = this.value >= 0 ? this.value : null">
						<!-- https://stackoverflow.com/questions/7372067/is-there-any-way-to-prevent-input-type-number-getting-negative-values -->
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
