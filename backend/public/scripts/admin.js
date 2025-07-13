let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}
else {
    document.querySelector("body").style.display = "block";
    document.querySelectorAll(".admin_id")[0].textContent = admin;
    document.querySelectorAll(".admin_id")[1].textContent = admin;
}