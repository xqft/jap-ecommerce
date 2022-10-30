import { getCart, setCartItemCount } from "./cart-data.js";
import { cartFormValidation } from "./cart-form.js";

const deliveryInfo = {
  "dt-standard": {text: "<b>Standard:</b> 12 a 15 días (5%)", fraction: 0.05},
  "dt-express":  {text: "<b>Express:</b> 5 a 6 días (7%)",    fraction: 0.07},
  "dt-premium":  {text: "<b>Premium:</b> 2 a 5 días (15%)",   fraction: 0.15},
};

document.addEventListener("DOMContentLoaded", async () => {
  const products = await getCart();
  const cartList = genCartList(products);

  document.getElementById("listBody").append(...cartList);
  updateCosts();

  setDeliveryTypeEvents();
  cartFormValidation(document.getElementById("cartForm"));
});

function genCartList(products) {
  return products.map(item => { 
    const {id, name, count, unitCost, currency, image} = item;

    /* HTML */
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

    /* Events */
    elem.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        localStorage.setItem("selectedProduct", id);
        window.location = "product-info.html";
      }
    });
    elem.querySelector("input").addEventListener("input", e => {
      elem.querySelector("span.subtotal").innerHTML = unitCost * Math.max(e.target.value, 1);
      setCartItemCount(id, Math.max(e.target.value, 1));
      updateCosts();
    });

    return elem;
  });
}

function setDeliveryTypeEvents() {
  document.querySelectorAll("#delivery-type > input").forEach(elem => {
    elem.addEventListener("click", () => {
      document.getElementById("deliveryTypeInfo").innerHTML = deliveryInfo[elem.id].text;
      elem.setAttribute("checked", "true");
      updateCosts();
    });
  });
}

function updateCosts() {
  const DOLLAR_TO_PESO = 40;

  const costs = {};
  const delivery = deliveryInfo[document.querySelector("#delivery-type :checked").id];
  
  getCart().then(products => {
    costs["subtotal"] = products
      .map(elem => elem.unitCost * elem.count / (elem.currency !== "USD" ? DOLLAR_TO_PESO : 1))
      .reduce((prev, current) => prev + current, 0);
    costs["delivery"] = costs.subtotal * delivery.fraction;
    costs["total"]    = costs.subtotal + costs.delivery;

    Object.entries(costs).forEach(([key, value]) => {
      document.querySelector(`.checkout-costs[name=${key}]`).innerHTML = "USD " + Math.round(value);
    });
  })
}

function elementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
