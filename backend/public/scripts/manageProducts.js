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
