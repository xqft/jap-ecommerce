window.addEventListener('DOMContentLoaded', () => {
  // redirect if logged in:
  const loggedIn = [sessionStorage, localStorage]
    .map(st => st.getItem("login-data-loggedin"))
    .some(elem => elem === "true");
  if (loggedIn) window.location = document.referrer;

  const loginForm = document.querySelector("#login-form");
  const needsValidationGroup = document.querySelector("#login-form .form-group.needs-validation");

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = Object.fromEntries((new FormData(loginForm)).entries());

    if (isFormValid(login)) {
      const storage = login.rememberme === "on" ? localStorage : sessionStorage

      storage.setItem("login-data-loggedin", true);
      localStorage.setItem("login-data-email", login.email);

      window.location = document.referrer;
    }
    else e.stopPropagation();

    needsValidationGroup.classList.add("was-validated");
  });
});

function isFormValid(form) {
  // checking for any empty entry:
  const oneEmpty = function (data) {
    for (const value in data) 
      if (data[value] === "") return true;
  }

  return !oneEmpty(form);
  // this function can be expanded with other validations.
}
