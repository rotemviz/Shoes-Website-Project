const registerFormEl = document.querySelector("[data-register-form]");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const passwordInput = document.getElementById("password");
const countryInput = document.getElementById("country");
const cityInput = document.getElementById("city");
const streetInput = document.getElementById("street");
const zipCodeInput = document.getElementById("zipCode");
const registerFormMsg = document.querySelector("[data-register-msg]");

registerFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const requestBody = {
        username: usernameInput.value,
        email: emailInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        age: ageInput.value,
        password: passwordInput.value,
        address: {
            country: countryInput.value,
            city: cityInput.value,
            street: streetInput.value,
            zipCode: zipCodeInput.value,
        },
    };
    const res = await fetch ("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
    const data = await res.json();
    if(data.error) {
        registerFormMsg.style.color = "#EA2027";
        registerFormMsg.innerHTML = data.error;
        setTimeout(() => {
            registerFormMsg.innerHTML = "";
            registerFormMsg.style.color = "";
        }, 4000);
    }
    else {
        registerFormMsg.style.color = "#009432";
        registerFormMsg.innerHTML = "Looks good !";
        setTimeout(() => {
            registerFormMsg.innerHTML = "";
            registerFormMsg.style.color = "";
        }, 4000);
        window.location.href = "../html/login.html"
    }
});