let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}
else {
    document.querySelector("body").style.display = "block";
}