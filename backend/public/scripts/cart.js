let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
    window.location.href = "/icescoop/login";
} else if (!exp & !email) {
    // window.location.href = "/icescoop/error";
    alert("login first");
    window.location.href = "/icescoop/login";
} else {
    document.querySelector("body").style.display = "flex";
}

let cartData = localStorage.getItem("cart");
if (cartData) {

}

function Goback() {
    window.location.href = "/icescoop";
}

function GoAcc() {
    window.location.href = "/icescoop/account";
}