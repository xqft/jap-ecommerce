window.addEventListener('DOMContentLoaded', () => {
	// redirect directly if values are saved:
	if (localStorage.getItem("login-data-rememberme") === "on") 
		window.location.assign("/index.html");

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
			for ([key, value] of login.entries()) {
				localStorage.setItem("login-data-" + key, value);
				console.log(key + value);
			}
			localStorage.setItem("login-data-loggedin", true);
			window.location.assign("/index.html");
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
