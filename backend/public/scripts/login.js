let login = document.getElementById("login-form");
let failure = document.getElementById("failure");
let success = document.getElementById("success");

login.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    // console.log(email, password);
    try {
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
            // After 1 sec redirect to home page
            setTimeout(() => {
                window.location.href = "/icescoop"
            }, 3000);
        }
    } catch (err) {
        failure.textContent = "Something went wrong⚠️";
        failure.style.display = "flex";
    }
});