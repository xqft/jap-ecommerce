document.addEventListener("DOMContentLoaded", () => {
	showNavbarUsername();
});

function showNavbarUsername() {
	const usernameNavbarNode = document.querySelector("#navbarUsername");
	const username = window.localStorage.getItem("login-data-email").split("@")[0];

	usernameNavbarNode.innerHTML = username;
}
