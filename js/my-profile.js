const loggedIn = [sessionStorage, localStorage]
  .map(st => st.getItem("login-data-loggedin"))
  .some(elem => elem === "true");
if (!loggedIn) window.location = "login.html";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");

  // fill every input with already stored values.
  form.querySelectorAll("input:not(#pictureInput)")
    .forEach(elem => elem.value = localStorage.getItem("profile-" + elem.id) ?? "");
  // set profile picture.
  document.querySelector("#profilePicture").src = localStorage.getItem("profile-picture") ?? "img/img_perfil.png";
  
  form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
      const data = new FormData(form);

      for (const [key, value] of data.entries())
        if (value) localStorage.setItem("profile-" + key, value); // if not empty, store.

      const imgFile = document.querySelector("#pictureInput").files[0];
      encodeImage(imgFile).then(url => {
        localStorage.setItem("profile-picture", url);
        document.querySelector("#profilePicture").src = url;
      });
    } else {
      e.preventDefault();
      e.stopPropagation();
    }

    // show validation feedback only for invalid inputs
    form.querySelectorAll("input:invalid")
      .forEach(elem => elem.parentElement.classList.add("was-validated"));
  });
});

function encodeImage(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);

    fr.addEventListener("load", () => resolve(fr.result));
    fr.addEventListener("error", reject);
  })
}
