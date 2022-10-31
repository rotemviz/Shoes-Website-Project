const userFavoritesEl = document.getElementById("all-favorites-div");
const msgContainerEl = document.getElementById("msgContainer");
const token = localStorage.getItem("token");

async function userCheck() {
    const res = await fetch("http://localhost:4000/auth/authentication", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token}),
    });
    const {user} = await res.json();
    return user;
}

async function removeFromFavorites(shoeId) {
    const user = await userCheck();
    const res = await fetch("http://localhost:4000/shoe/removeFromFavorites", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({shoeId, user})
    });
    const data = await res.json();
    if(data.error) {
        msgContainerEl.innerHTML = `<p>${user.error}</p>`;
        setTimeout(() => {
            msgContainerEl.innerHTML = "";
        }, 4000);
        return;
    }
    if(data.message === "needs reload")
        window.location.reload();
    msgContainerEl.style.color = "#009432";
    msgContainerEl.innerHTML = `<p>Removed from your favorites</p>`;
    setTimeout(() => {
            msgContainerEl.innerHTML = "";
    }, 4000);
    await getAllFavorites();
}

async function showcaseFavorites(favorites) {
    const favoritesEl = favorites.map((favorite) => {
        const imgClickSrc = "../images/remove-from-favorites-icon.png";
        return `
            <div class="favoriteDetails">
            <img src="${favorite.imgSource}"/>
            <p><span>Brand:</span> ${favorite.brand}</p>
            <p><span>Model:</span> ${favorite.model}</p>
            <p><span>Gender:</span> ${favorite.gender}</p>
            <p><span>color:</span> ${favorite.color}</p>
            <p><span>Made in:</span> ${favorite.madeIn}</p>
            <img src=${imgClickSrc} alt="remove-from-favorites-icon" id="removeFromFav" onclick="removeFromFavorites('${favorite._id}')"></img>
            </div>
        `
    });
    userFavoritesEl.innerHTML = favoritesEl.join("");
}

async function getAllFavorites() {
    const {favorites} = await userCheck();
    const res = await fetch("http://localhost:4000/shoe/userFavorites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({favorites}),
    });
    const data = await res.json();
    if(data.error)
    {
        msgContainerEl.style.color = "#EA2027";
        msgContainerEl.innerHTML = `<p>${data.error}</p>`;
    }
    else
        showcaseFavorites(data);
}

window.addEventListener("DOMContentLoaded", getAllFavorites);