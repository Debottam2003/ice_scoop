let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}

function goAdmin() {
  window.location.href = "/icescoop/admin";
}

function stockToggle() {
  let stockArray = document.querySelectorAll(".stock");
  let displayArray = document.querySelectorAll(".instock");

  for (let i = 0; i < stockArray.length; i++) {
    stockArray[i].addEventListener("click", () => {
      if (stockArray[i].classList.contains("d")) {
        stockArray[i].textContent = "In Stock";
        stockArray[i].classList.remove("d");
        displayArray[i].textContent = "No";
      } else {
        stockArray[i].textContent = "Out Of Stock";
        stockArray[i].classList.add("d");
        displayArray[i].textContent = "Yes";
      }
    });
  }
}
stockToggle();

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅