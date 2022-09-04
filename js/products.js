window.addEventListener("DOMContentLoaded", () => {
	const productList = document.querySelector("#productList");	
	const categoryId = localStorage.getItem("catID") || 101; // default category is "autos"

		spinnerGetJSONData(PRODUCTS_URL + categoryId + EXT_TYPE)
			.then(data => {
				productList.innerHTML = buildProductListHTML(data);
		}).catch(err => {
			productList.innerHTML =
				`<div class="container">
					<div class="alert alert-danger text-center" role="alert">
					<h4 class="alert-heading">${err}</h4>
					</div>
				</div>`;
		});
});

function buildProductListHTML(category) {
	const products = category.products;
	let result =
		`<div class="pb-5 px-3 px-sm-0 container-fluid text-left">
			<div class="display-1">${category.catName}</div>
			<div class="lead">Se han encontrado <strong>${products.length}</strong> productos:</div>
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
