const userStatusNavbarEl = document.getElementById("userStatus");
const logoutEl = document.querySelector("[data-user-logout]");
const favoritesLinkEl = document.getElementById("favorites");

async function userStatusCheck() {
    const token  = localStorage.getItem("token");
    if(!token)
        return false;
    const res = await fetch("http://localhost:4000/auth/authentication", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token}),
    });
    const user = await res.json();
    return user;
}

async function initialApp() {
    const {user} = await userStatusCheck();
    if(!user) {
        userStatusNavbarEl.innerHTML = `
            <a href="login.html">Please login</a>
            <hr>
            <a href="register.html">Don't have an account? Click here</a>
        `;
        logoutEl.style.display = "none";
        favoritesLinkEl.style.display = "none";
    }
    else {
        const firstUsernameChar = user.username.charAt(0);
        userStatusNavbarEl.innerHTML = `
            ${firstUsernameChar.toUpperCase()}
        `;
        userStatusNavbarEl.style.fontSize = "1.2rem";
        userStatusNavbarEl.style.border = "4px solid rgba(248, 248, 255, 0.571)";
        userStatusNavbarEl.style.borderRadius = "50%";
        userStatusNavbarEl.style.backgroundColor = "rgba(211, 211, 211, 0.89)"
    }   
}

initialApp();