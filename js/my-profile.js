const loggedIn = [sessionStorage, localStorage]
  .map(st => st.getItem("login-data-loggedin"))
  .some(elem => elem === "true");
if (!loggedIn) window.location = "login.html";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");

  // fill every input with already stored values.
  form.querySelectorAll("input:not([type='file'])")
    .forEach(elem => elem.value = localStorage.getItem("profile-" + elem.id) ?? "");
  
  form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
      const data = new FormData(form);

      for (const [key, value] of data.entries())
        if (value) localStorage.setItem("profile-" + key, value); // if not empty, store.
    } else {
      e.preventDefault();
      e.stopPropagation();
    }

    // show validation feedback only for invalid inputs
    form.querySelectorAll("input:invalid")
      .forEach(elem => elem.parentElement.classList.add("was-validated"));
  });
});
