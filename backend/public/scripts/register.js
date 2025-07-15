let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");

if (exp && exp <= Date.now()) {

    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
    localStorage.removeItem("cart");

} else if (exp && exp > Date.now()) {
    window.location.href = "/icescoop";
}

let register = document.getElementById("register-form");
let failure = document.getElementById("failure");
let success = document.getElementById("success");

register.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let address = document.getElementById("address").value;
    let pin_code = document.getElementById("pin_code").value;
    let phone = document.getElementById("phone").value;
    // console.log(email, password, address, pin_code);
    try {
        failure.style.display = "none";
        success.style.display = "none";
        let response = await fetch("https://ice-scoop.onrender.com/icescoop/userRegister", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, address, pin_code, phone })
        });
        if (!response.ok) {
            let data = await response.json();
            console.log(data.message);
            failure.textContent = data.message;
            failure.style.display = "flex";
            return;
        }
        else {
            let data = await response.json();
            success.textContent = data.message;
            failure.style.display = "none";
            success.style.display = "flex";
            let time_limit = Date.now() + 1000 * 60 * 20
            localStorage.setItem("userEmail", email);
            localStorage.setItem("exp", time_limit);
            // After 1.5 sec redirect to home page
            setTimeout(() => {
                success.style.display = "none";
                window.location.href = "/icescoop"
            }, 1500);
        }
    } catch (err) {
        failure.textContent = "Something went wrong⚠️";
        failure.style.display = "flex";
    }
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅