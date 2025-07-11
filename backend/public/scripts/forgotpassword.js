let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
} else if (exp && email && exp > Date.now()) {
    window.location.href = "/icescoop";
}

let form = document.getElementById("login-form");
let failure = document.getElementById("failure");
let success = document.getElementById("success");
let sendOTP = document.getElementById("send-otp");

sendOTP.addEventListener("click", async () => {
    console.log("send otp ready");
    email = document.getElementById("email").value;
    if (!email) {
        alert("Enter your email");
        return;
    }
    try {
        failure.style.display = "none";
        success.style.display = "none";
        let response = await fetch("http://localhost:3333/icescoop/otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            let data = await response.json();
            console.log(data.message);
            failure.textContent = data.message;
            failure.style.display = "flex";
            return;
        } else {
            let data = await response.json();
            console.log(data.message);
            success.textContent = data.message;
            failure.style.display = "none";
            success.style.display = "flex";
            sendOTP.textContent = "Resend OTP"
        }
    } catch (err) {
        // console.log(err.message);
    }
});