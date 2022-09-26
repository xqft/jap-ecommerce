document.addEventListener("DOMContentLoaded", () => {
  loadNavbar().then(navbar => { 
    document.querySelector("#navbar").replaceWith(navbar)
    showNavbarUsername();
  })
  .catch(err => console.error("Could not load navbar.html: " + err));

});

async function loadNavbar() {
  const response = await fetch("navbar.html");
  const html = await response.text();

  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
}

function showNavbarUsername() {
  const usernameNavbarNode = document.querySelector("#navbarUsername");
  const username = (window.localStorage.getItem("login-data-email") ?? "Invitado").split("@")[0];

  usernameNavbarNode.innerHTML = username;
}
