let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
    localStorage.removeItem("cart");
} else if (exp && email && exp > Date.now()) {
    window.location.href = "/icescoop";
}

let login = document.getElementById("login-form");
let failure = document.getElementById("failure");
let success = document.getElementById("success");

login.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    try {
        failure.style.display = "none";
        success.style.display = "none";
        let response = await fetch("http://localhost:3333/icescoop/userLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
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
            let time_limit = Date.now() + 1000 * 60 * 20;
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

let forgotPassword = document.getElementById("forgot-password");
forgotPassword.addEventListener("click", (e) => {
    window.location.href = "/icescoop/forgotpassword";
});

