let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
  // Remove the session markers
  localStorage.removeItem("userEmail");
  localStorage.removeItem("exp");
  window.location.href = "/icescoop/login";
} else if (!exp & !email) {
  // window.location.href = "/icescoop/error";
  alert("login first");
  window.location.href = "/icescoop/login";
} else {
  document.querySelector("body").style.display = "flex";
}

let cartData = localStorage.getItem("cart");
let cartItems;
let total = 0;

if (cartData) {
  cartItems = JSON.parse(cartData);
} else {
  cartItems = [];
  document.getElementById("cart-section").innerHTML = `<h2>Cart is Empty</h2>`;
}


for (let i = 0; i < cartItems.length; i++) {
  let cart_item = document.createElement("div");
  cart_item.id = "cart-item";

  let item_img = document.createElement("img");
  item_img.id = "item-img";
  item_img.src = cartItems[i].image;

  let item_name = document.createElement("h4");
  item_name.id = "item-name";
  item_name.textContent = cartItems[i].name;

  let item_no = document.createElement("p");
  item_no.id = "item-no";
  item_no.textContent = cartItems[i].total;

  let item_quantity = document.createElement("p");
  item_quantity.id = "item-quantity";
  item_quantity.textContent = cartItems[i].type;

  let item_cost = document.createElement("p");
  item_cost.id = "item-cost";
  item_cost.textContent = "₹" + cartItems[i].price;
  total += Number(cartItems[i].price);

  let remove = document.createElement("button");
  remove.id = "remove-item";
  remove.textContent = "Remove";

  cart_item.appendChild(item_img);
  cart_item.appendChild(item_name);
  cart_item.appendChild(item_no);
  cart_item.appendChild(item_quantity);
  cart_item.appendChild(item_cost);
  cart_item.appendChild(remove);

  document.getElementById("cart-section").appendChild(cart_item);
}

document.getElementById("total-price").textContent += " " + total;

function Goback() {
  window.location.href = "/icescoop/flavours";
}

function GoAcc() {
  window.location.href = "/icescoop/account";
}
