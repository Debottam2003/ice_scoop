let admin = localStorage.getItem("admin");
if (admin) {
    window.location.href = "/icescoop/admin";
}

function Goback() {
    window.location.href = '/icescoop';
}

function goToCart() {
    window.location.href = '/icescoop/cart';
}
function goOrder() {
    window.location.href = `/icescoop/orders`;
}
let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
    localStorage.removeItem("cart");
    window.location.href = "/icescoop";
} else if (exp && exp > Date.now()) {
    document.querySelector("body").style.display = "flex";
} else {
    // window.location.href = "/icescoop";
    window.location.href = "/icescoop/error";
}

let image = document.getElementById("userImg");
let username = document.getElementById("userName");
let address = document.getElementById("userAddress");
let pinCode = document.getElementById("pin_code");

async function getUserData() {
    try {
        if (email) {
            console.log(email);
            let response = await fetch(`https://ice-scoop.onrender.com/icescoop/account/${email}`);
            if (!response.ok) {
                console.log("Something went wrong");
            }
            else {
                let data = await response.json();
                image.textContent = data.message[0].email[0].toUpperCase();
                username.textContent += data.message[0].email;
                address.textContent += data.message[0].address.toUpperCase().slice(0, 21);
                pinCode.textContent += data.message[0].pin_code;
                let str = "name";
            }
        }
    } catch (err) {
        // console.log("something went wrong");
        alert("something went wrong");
    }
}
getUserData();


let logout = document.getElementById("logout");
logout.addEventListener("click", async () => {
    let sure = confirm("Are you sure?");
    if (sure) {
        try {
            let response = await fetch(`https://ice-scoop.onrender.com/icescoop/logout/${email}`);
            if (!response.ok) {
                alert("Something went wrong!");
                let data = await response.json();
                // console.log(data.message);
            } else {
                let data = await response.json();
                alert(data.message);
                localStorage.removeItem("userEmail");
                localStorage.removeItem("exp");
                localStorage.removeItem("cart");
                setTimeout(() => {
                    window.location.href = "/icescoop";
                }, 500);
            }
        } catch (err) {
            alert("Something went wrong!");
        }
    }
});

// Cart item increment
function itemIncrement() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let total = 0;
    cart.forEach((c) => {
        total += Number(c.total);
    });
    document.getElementById("index").textContent = total;
}
itemIncrement();

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅