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

let form = document.getElementById("login-form");
let failure = document.getElementById("failure");
let success = document.getElementById("success");
let sendOTP = document.getElementById("send-otp");
let newPassword = document.getElementById("password");
let submit = document.getElementById("submit");
let otp = document.getElementById("otp");

sendOTP.addEventListener("click", async () => {
    newPassword.style.display = "none";
    submit.style.display = 'none';
    otp.style.display = "none";
    // console.log("send otp ready");
    email = document.getElementById("email").value;
    if (!email) {
        alert("Enter your email");
        return;
    }
    try {
        failure.style.display = "none";
        success.style.display = "none";
        sendOTP.textContent = "Sending...";
        let response = await fetch("https://ice-scoop.onrender.com/icescoop/otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            let data = await response.json();
            // console.log(data.message);
            failure.textContent = data.message;
            failure.style.display = "flex";
            sendOTP.textContent = "Resend OTP";
            return;
        } else {
            let data = await response.json();
            // console.log(data.message);
            success.textContent = data.message;
            failure.style.display = "none";
            success.style.display = "flex";
            newPassword.style.display = "block";
            submit.style.display = 'block';
            otp.style.display = "block";
            sendOTP.textContent = "Resend OTP"
        }
    } catch (err) {
        // console.log(err.message);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    failure.style.display = "none";
    success.style.display = "none";
    let email = document.getElementById("email").value;
    let newPassword = document.getElementById("password").value;
    let otp = document.getElementById("otp").value;
    try {
        submit.textContent = "Processing...";
        let response = await fetch("https://ice-scoop.onrender.com/icescoop/resetpassword", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, newPassword, otp })
        });
        if (!response.ok) {
            let data = await response.json();
            // console.log(data.message);
            failure.textContent = data.message;
            failure.style.display = "flex";
            sendOTP.textContent = "Resend OTP";
            submit.textContent = "Submit";
            return;
        } else {
            let data = await response.json();
            // console.log(data.message);
            success.textContent = data.message;
            failure.style.display = "none";
            success.style.display = "flex";
            submit.textContent = "Submit";
            setTimeout(() => {
                window.location.href = "/icescoop/login";
            }, 1000);
        }
    } catch (err) {
        failure.textContent = "Something Went Wrong";
        failure.style.display = "flex";
        submit.textContent = "Submit";
        sendOTP.textContent = "Resend OTP";
        return;
    }
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅