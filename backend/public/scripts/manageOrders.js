let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}

function goAdmin(){
    window.location.href='/icescoop/admin';
};

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅