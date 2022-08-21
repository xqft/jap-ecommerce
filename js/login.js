window.addEventListener('DOMContentLoaded', () => {
	// redirect directly if values are saved:
	if (	sessionStorage.getItem("login-data-loggedin") === "true" ||
				localStorage.getItem("login-data-loggedin") === "true") 
		window.location = "index.html";

	const loginForm = document.querySelector("#login-form");
	const needsValidateFormGroup = document.querySelector("#login-form .form-group.needs-validation");

	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		new FormData(loginForm);
	});

	loginForm.addEventListener('formdata', (e) => {
		const login = e.formData;

		if (isFormValid(login)) {
			// save data
			for ([key, value] of login.entries()) 
				if(key !== "rememberme") 
					localStorage.setItem("login-data-" + key, value);

			if (login.get("rememberme") === "on")
				localStorage.setItem("login-data-loggedin", true);
			else
				sessionStorage.setItem("login-data-loggedin", true);
			window.location = "index.html";
		}
		else e.stopPropagation();

		needsValidateFormGroup.classList.add("was-validated");
	});
});

function isFormValid(form) {
	// checking for any empty entry:
	const oneEmpty = Array.from(form.values()).some(value => value.trim().length === 0);

	return !oneEmpty;
	// this function can be expanded with other validations.
}
