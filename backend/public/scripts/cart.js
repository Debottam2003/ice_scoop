function Goback() {
  window.location.href = "/icescoop/flavours";
}

function GoAcc() {
  window.location.href = "/icescoop/account";
}

let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
  // Remove the session markers
  localStorage.removeItem("userEmail");
  localStorage.removeItem("exp");
  localStorage.removeItem("cart");
  window.location.href = "/icescoop/login";
} else if (!exp && !email) {
  // window.location.href = "/icescoop/error";
  alert("login first");
  window.location.href = "/icescoop/login";
} else {
  document.querySelector("body").style.display = "flex";
}

function bringCartData() {
  let cartItems;
  let total = 0;
  // Load the cart data from the local storage
  let cartData = localStorage.getItem("cart");
  if (cartData) {
    cartItems = JSON.parse(cartData);
    if (cartItems.length === 0) {
      document.getElementById(
        "cart-section"
      ).innerHTML = `<h2>Cart is Empty</h2>`;
      document.getElementById("total-price").textContent = " ₹0";
      return;
    }
  } else {
    cartItems = [];
    document.getElementById(
      "cart-section"
    ).innerHTML = `<h2>Cart is Empty</h2>`;
    document.getElementById("total-price").textContent = "₹0";
    return;
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
    item_quantity.textContent = cartItems[i].type.toUpperCase();

    let item_cost = document.createElement("p");
    item_cost.id = "item-cost";
    item_cost.textContent = "₹" + cartItems[i].price;
    total += Number(cartItems[i].price);

    let remove = document.createElement("button");
    remove.classList.add("remove-item");
    remove.id = i;
    remove.textContent = "Remove";

    cart_item.appendChild(item_img);
    cart_item.appendChild(item_name);
    cart_item.appendChild(item_no);
    cart_item.appendChild(item_quantity);
    cart_item.appendChild(item_cost);
    cart_item.appendChild(remove);

    document.getElementById("cart-section").appendChild(cart_item);
  }
  document.getElementById("total-price").textContent = ` ₹${total}`;

  // Remove items
  let removeButtons = document.querySelectorAll(".remove-item");
  // console.log(removeButtons);
  removeButtons.forEach((rb) => {
    rb.addEventListener("click", (e) => {
      // alert("btn click");
      cartItems = cartItems.filter((element, index) => {
        if (index === Number(e.target.id)) {
          total -= Number(element.price);
          console.log(element.price);
        }
        return index !== Number(e.target.id);
      });
      localStorage.setItem("cart", JSON.stringify(cartItems));
      document.getElementById("cart-section").innerHTML = "";
      setTimeout(() => {
        bringCartData();
      }, 50);
    });
  });
}

bringCartData();

document.getElementById("checkout").addEventListener("click", makeOrder);

async function makeOrder() {
  let cart = localStorage.getItem("cart");
  let cartData = JSON.parse(cart);
  try {
    // console.log("ok");
    let response = await fetch("http://localhost:3333/icescoop/placeorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, cartData }),
    });
    if (!response.ok) {
      alert("Couldn't place your order!");
    } else {
      alert("Order Placed");
      localStorage.removeItem("cart");
      setTimeout(() => {
        window.location.href = "/icescoop/orders";
      }, 200);
    }
  } catch (err) {
    console.log("Internal Server error!");
  }
}
