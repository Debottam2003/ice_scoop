function Goback() {
    window.location.href = '/icescoop';
}

let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
    window.location.href = "/icescoop";
} else if (exp && exp > Date.now()) {

} else {
    window.location.href = "/icescoop";
}

let image = document.getElementById("userImg");
let username = document.getElementById("userName");
let address = document.getElementById("userAddress");
let pinCode = document.getElementById("pin_code");

async function getUserData() {
    try {
        if (email) {
            console.log(email);
            let response = await fetch(`http://localhost:3333/icescoop/account/${email}`);
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
        console.log("something went wrong");
    }
}
getUserData();


let logout = document.getElementById("logout");
logout.addEventListener("click", async () => {
    let sure = confirm("Are you sure?");
    if (sure) {
        try {
            let response = await fetch(`http://localhost:3333/icescoop/logout/${email}`);
            if (!response.ok) {
                alert("Something went wrong!");
            } else {
                let data = await response.json();
                alert(data.message);
                localStorage.removeItem("userEmail");
                localStorage.removeItem("exp");
                setTimeout(() =>{
                    window.location.href = "/icescoop";
                }, 500);
            }
        } catch (err) {
            alert("Something went wrong!");
        }
    }
})
