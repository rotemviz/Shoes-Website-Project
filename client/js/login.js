const loginFormEl = document.querySelector("[data-login-form]");
const usernameInputEl = document.getElementById("username");
const passwordInputEl = document.getElementById("password");
const loginMessageEl = document.querySelector("[data-login-msg]");
const showPasswordEl = document.getElementById("showPassword");

loginFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const requestBody = {
        username: usernameInputEl.value,
        password: passwordInputEl.value,
    };
    const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
    const data = await res.json();

    const {error, token} = data;
    if(error) {
        loginMessageEl.innerHTML = error;
        loginMessageEl.style.color = "#EA2027";
        setTimeout(() => {
            loginMessageEl.innerHTML = "";
            loginMessageEl.style.color = "";
        }, 4000);
    }
    else if(token) {
        loginMessageEl.style.color = "#009432";
        loginMessageEl.innerHTML = "Looks good !";
        localStorage.setItem("token", token);
        setTimeout(() => {
            loginMessageEl.innerHTML = "";
            loginMessageEl.style.color = "";
        }, 4000);
        window.location.href = "../html/main.html"
    }
});

showPasswordEl.addEventListener("change", () => {
  if(passwordInputEl.type === "password")
    passwordInputEl.type = "text";
  else
    passwordInputEl.type = "password";
});