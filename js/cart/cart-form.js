export function cartFormValidation(form) {
  document.querySelectorAll(".payment-method-radio input").forEach(input => {
    input.addEventListener("change", () => paymentMethodInputsEnableDisable(input));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() && fieldsetCheckValidity()) {
      paymentSuccess();
    } else {
      // add .was-validated to all relevant elements
      document.querySelectorAll("form, fieldset")
        .forEach(elem => elem.classList.add("was-validated"));

      validatePaymentMethod();

      // update payment method button feedback on every input's "input" event.
      document.querySelectorAll("fieldset input")
        .forEach(elem => elem.addEventListener("input", validatePaymentMethod));
    }
  });
}

function validatePaymentMethod() {
  const fieldsetWasValidated = document.querySelector("fieldset:not([disabled])")
    .classList.contains("was-validated");

  const payMethodBtn = document.getElementById("payMethodBtn");

  if (fieldsetCheckValidity())    payMethodBtn.classList.remove("is-invalid")
  else if (fieldsetWasValidated)  payMethodBtn.classList.add("is-invalid");
}

function paymentMethodInputsEnableDisable(elem) {
  // disable inputs depending on payment method election.
  const toDisable = elem.id === "creditCardRadio"   ? "bankTransferSet" : "creditCardSet";
  const toEnable  = elem.id === "bankTransferRadio" ? "bankTransferSet" : "creditCardSet";

  document.getElementById(toDisable)   .setAttribute("disabled", "");
  document.getElementById(toEnable) .removeAttribute("disabled");

  validatePaymentMethod();
}

function paymentSuccess() {
  document.querySelector("main").innerHTML +=
  `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>¡Felicidades!</strong> La compra ha sido realizada con éxito.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `

  document.querySelectorAll(".was-validated")
    .forEach(elem => elem.classList.remove("was-validated"));
}

function fieldsetCheckValidity() {
  return Array.from(document
    .querySelectorAll("fieldset:not([disabled]) input"))
    .map(elem => elem.checkValidity())
    .reduce((prev, current) => prev && current, true);
  // a single invalid input will make this false.
  // this is necessary as checkValidity() doesn't work in a fieldset.
}
