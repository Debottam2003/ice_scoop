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
      // alert('hello');
      if (stockArray[i].classList.contains("d")) {
        stockArray[i].textContent = "In Stock";
        stockArray[i].classList.remove("d");
        displayArray[i].textContent = "❌";
      } else {
        stockArray[i].textContent = "Out Of Stock";
        stockArray[i].classList.add("d");
        displayArray[i].textContent = "✅";
      }
    });
  }
}

window.addEventListener("pageshow", (event) => {
  if (
    event.persisted ||
    performance.getEntriesByType("navigation")[0].type === "back_forward"
  ) {
    location.reload();
  }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅
let table = document.querySelector("#ordersTable");
//update product table data
function uploadProduct(product) {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  td1.textContent = product.icecream_id;
  let td2 = document.createElement("td");
  td2.textContent = product.name.replaceAll("_"," ");
  let td3 = document.createElement("td");
  td3.textContent ="₹ "+product.regular_price;
  let td4 = document.createElement("td");
  td4.textContent ="₹ "+product.standard_price;
  let td5 = document.createElement("td");
  td5.textContent = "₹ "+product.premium_price;
  let td6 = document.createElement("td");
  td6.textContent = product.in_stock? "✅" :"❌";
  td6.classList.add("instock");
  let td7 = document.createElement("td");
  let button1 = document.createElement("button");
  button1.textContent = "Out Of Stock";
  button1.classList.add("stock");
  if (product.in_stock === true) {
    button1.classList.add("d");
  }
  let span1 = document.createElement("span");
  span1.textContent = "---";
  let button2 = document.createElement("button");
  button2.textContent = "Edit";
  td7.appendChild(button1);
  td7.appendChild(span1);
  td7.appendChild(button2);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  tr.appendChild(td6);
  tr.appendChild(td7);

  table.appendChild(tr);
}

// fetch all products in admin .
async function updateProducts() {
  try {
    let response = await fetch(
      "http://localhost:3333/icescoop/admin/icecreams"
    );
    if (!response.ok) {
      let wrong = document.createElement("h2");
      wrong.textContent = "No Items";
      wrong.style.textAlign = "center";
      // wrong.id = "no-icecream";
      document.querySelector("ordersTable").appendChild(wrong);
    } else {
      let data = await response.json();
      console.log("data fetched successfully");
      let productsArray = data.message;
      if (productsArray.length > 0) {
        productsArray.forEach((product) => {
          uploadProduct(product);
        });
        stockToggle();
      } else {
        console.log("NO DATA FOUND");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}
updateProducts();
