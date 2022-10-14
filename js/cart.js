const cart = spinnerGetJSONData(CART_INFO_URL + "25801" + EXT_TYPE);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#delivery-type > input").forEach(setDeliveryInfo);

  const body = document.querySelector("#listBody");

  cart.then(data => {
   const list = data.articles.reduce((accum, item) => {
          const {id, name, count, unitCost, currency, image} = item;

          const elem = elementFromHTML(
          `<tr class="text-center"><b>Standard:</b> 12 a 15 días (5%)
            <td><a href="#"><img src="${image}" class="rounded img-fluid" style="min-width: 5rem; max-width: 7rem"></a></td>
            <td><h4>${name}</h4></td>
            <td style="max-width: 1rem;">
            <input type="number" class="form-control" min="1" value="${count}"
              onblur="this.value = this.value >= 1 ? this.value : 1">
            </td>
            <td>
              <h4>${currency} <span class="subtotal">${unitCost * count}</span></h4>
              (${currency} ${unitCost} unitario)
            </td>
          </tr>`);

          elem.addEventListener("click", (e) => {
            if (e.target.tagName === "IMG") {
              localStorage.setItem("selectedProduct", id);
              window.location = "product-info.html";
            }
          });
          elem.querySelector("input").addEventListener("input", e =>
            elem.querySelector("span.subtotal").innerHTML = unitCost * Math.max(e.target.value, 1));

          return accum.appendChild(elem);
        }, document.createElement("div"));

    body.appendChild(list);
  })
})

function setDeliveryInfo(elem) {
  const info = (() => {
    switch (elem.getAttribute("name")) {
      case "dt-standard": return "<b>Standard:</b> 12 a 15 días (5%)";
      case "dt-express":  return "<b>Express:</b> 5 a 6 días (7%)";
      case "dt-premium":  return "<b>Premium:</b> 2 a 5 días (15%)";
    }
  })();

  elem.addEventListener("click", () => {
    document.getElementById("deliveryTypeInfo").innerHTML = info;
  }) 
}

function elementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
