let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}
else {
    document.querySelector("body").style.display = "block";
    document.querySelectorAll(".admin_id")[0].textContent = admin;
    document.querySelectorAll(".admin_id")[1].textContent = admin;
}

let logOut = document.getElementById("log-out-btn");
logOut.addEventListener("click", () => {
    let sure = confirm("Are you sure?");
    if (sure) {
        localStorage.removeItem("admin");
        setTimeout(() => {
            window.location.href = "/icescoop";
        }, 200);
    }
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅