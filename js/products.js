window.addEventListener("DOMContentLoaded", () => {
	const productList = document.querySelector("#productList");	
	let categoryId = localStorage.getItem("catID");
	if (categoryId === null) categoryId = "101";

	// TODO: Rewrite getJSONData() as I don't find it well designed
	getJSONData(PRODUCTS_URL + categoryId + EXT_TYPE).then(({data, status}) => {
		if (status === "ok") productList.innerHTML = buildProductListHTML(data)
		else
			productList.innerHTML =
				`<div class="container">
					<div class="alert alert-danger text-center" role="alert">
					<h4 class="alert-heading">${data}</h4>
					</div>
				</div>`;
	});
});

function buildProductListHTML(category) {
	const products = category.products;
	let result =
		`<div class="row px-3 px-sm-0 text-left">
			<div class="display-1">${category.catName}</div>
			<div class="lead">Se han encontrado <strong>${products.length}</strong> productos:</div>
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
