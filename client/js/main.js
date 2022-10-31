const allShoesShowcaseEl = document.getElementById("all-shoes-div");
const msgContainerEl = document.getElementById("msgContainer");
const addToFavoritesEl = document.getElementsByClassName("addToFavImg")
const searchBoxFormEl = document.querySelector("[data-search-form]");
const searchBoxInputEl = document.getElementById("searchBoxInput");
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
    msgContainerEl.style.color = "#009432";
    msgContainerEl.innerHTML = `<p>Removed from your favorites</p>`;
    setTimeout(() => {
            msgContainerEl.innerHTML = "";
        }, 4000);
    await getAllShoes();
}

async function addToFavorites(shoeId) {
    const user = await userCheck();
    if(user.error) {
        msgContainerEl.innerHTML = `<p>${user.error}</p>`;
        setTimeout(() => {
            msgContainerEl.innerHTML = "";
        }, 4000);
        return;
    }
    const res = await fetch("http://localhost:4000/shoe/addToFavorites", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({shoeId, user})
    });
    const data = await res.json();
    if(data.error) {
        msgContainerEl.style.color = "#EA2027";
        msgContainerEl.innerHTML = `<p>${data.error}</p>`;
        setTimeout(() => {
            msgContainerEl.innerHTML = "";
        }, 4000);
        return;
    }
    msgContainerEl.style.color = "#009432";
    msgContainerEl.innerHTML = `<p>Added to your favorites</p>`;
    setTimeout(() => {
            msgContainerEl.innerHTML = "";
        }, 4000);
    await getAllShoes();
}

function showcaseShoes(shoes) {
    const shoesElement = shoes.map((shoe) => `
        <div class="shoeDetails">
            <img src="${shoe.imgSource}"/>
            <p><span>Brand:</span> ${shoe.brand}</p>
            <p><span>Model:</span> ${shoe.model}</p>
            <p><span>Gender:</span> ${shoe.gender}</p>
            <p><span>color:</span> ${shoe.color}</p>
            <p><span>Made in:</span> ${shoe.madeIn}</p>
        </div>
    `);
    allShoesShowcaseEl.innerHTML = shoesElement.join("");
};

async function showcaseShoesWithAddToFavoritesButton(shoes) {
    const user = await userCheck();
    let iconSrc, iconSrcOnClick;
    const shoesElement = shoes.map((shoe) => {
        if(user.favorites.includes(shoe._id)) {
            iconSrc = "../images/remove-from-favorites-icon.png";
            iconSrcOnClick = "../images/add-to-favorites-icon.png";
            return `
            <div class="shoeDetails">
            <img src="${shoe.imgSource}"/>
            <p><span>Brand:</span> ${shoe.brand}</p>
            <p><span>Model:</span> ${shoe.model}</p>
            <p><span>Gender:</span> ${shoe.gender}</p>
            <p><span>color:</span> ${shoe.color}</p>
            <p><span>Made in:</span> ${shoe.madeIn}</p>
            <img src=${iconSrc} alt="add-to-favorites-icon" id="removeFromFav" onclick="removeFromFavorites('${shoe._id}'); this.src='${iconSrcOnClick}';"></img>
            </div>
            `
        }
        else {
            iconSrc = "../images/add-to-favorites-icon.png";
            iconSrcOnClick = "../images/remove-from-favorites-icon.png";
            return `
            <div class="shoeDetails">
            <img src="${shoe.imgSource}"/>
            <p><span>Brand:</span> ${shoe.brand}</p>
            <p><span>Model:</span> ${shoe.model}</p>
            <p><span>Gender:</span> ${shoe.gender}</p>
            <p><span>color:</span> ${shoe.color}</p>
            <p><span>Made in:</span> ${shoe.madeIn}</p>
            <img src=${iconSrc} alt="add-to-favorites-icon" id="addToFav" onclick="addToFavorites('${shoe._id}'); this.src='${iconSrcOnClick}';"></img>
            </div>
            `
        }
    });
    allShoesShowcaseEl.innerHTML = shoesElement.join("");
};

async function getAllShoes() {
    const res = await fetch("http://localhost:4000/shoe/all");
    const data = await res.json();
    if(data.error)
        allShoesShowcaseEl.innerHTML = `<p>${data.error}</p>`;
    else
        if(!token)
            showcaseShoes(data);
        else
            showcaseShoesWithAddToFavoritesButton(data);
};

window.addEventListener("DOMContentLoaded", getAllShoes);

searchBoxFormEl.addEventListener("input", async (e) => {
    e.preventDefault();
    console.log(searchBoxInputEl.value);
    const requestBody = {searchContent: searchBoxInputEl.value};
    const res = await fetch("http://localhost:4000/shoe/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        
        body: JSON.stringify(requestBody)
    });
    const data = await res.json();
    if(data.error) {
        msgContainerEl.style.color = "#EA2027";
        msgContainerEl.innerHTML = `<p>${data.error}</p>`;
        return;
    }
    msgContainerEl.style.color = "#009432";
    msgContainerEl.innerHTML = `<p>Results:</p>`;
    console.log(data);
    if(!token)
        showcaseShoes(data);
    else
        showcaseShoesWithAddToFavoritesButton(data);
})