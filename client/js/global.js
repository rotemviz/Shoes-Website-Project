const userLogoutEl = document.querySelector("[data-user-logout]");


function logout() {
    localStorage.removeItem("token");
}

userLogoutEl.addEventListener("click", logout);