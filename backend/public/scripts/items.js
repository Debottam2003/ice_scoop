let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
    // Remove the session markers
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
}

// Go back to home
function Goback() {
    window.location.href = '/icescoop';
}

// Go to cart
function goToCart() {
    window.location.href = '/icescoop/cart';
}

let body = document.querySelector("body");
let container = document.getElementById("items-container");
let choice = document.getElementById("choice");
let choice_img = document.getElementById("choice-img");
let choice_name = document.getElementById("choice-name");
let choice_description = document.getElementById("choice-description");
let regular = document.getElementById("regular");
let standard = document.getElementById("standard");
let premium = document.getElementById("premium");
let decreaseBTN = document.getElementById("decrease");
let increaseBTN = document.getElementById("increase");
let add = document.getElementById("choice-add");
let choice_radio = document.getElementById("choice-radio");

let orders = [];
let cartData = localStorage.getItem("cart");
if (cartData) {
    orders = JSON.parse(cartData);
} else orders = [];

// Add to cart function
function cartADD() {
    const selectedRadio = document.querySelector('input[name="quality"]:checked');
    if (!selectedRadio) {
        // console.log("Selected value:", selectedRadio.value);
        alert("Select the type");
        return;
    }
    // let select = false;
    let total = document.getElementById("total-no");
    let reg = document.getElementsByName("quality");
    // console.log(reg);
    let item = {};
    item["image"] = choice_img.src;
    item["name"] = choice_name.textContent;
    for (let i = 0; i < reg.length; i++) {
        // console.log(reg);
        if (reg[i].checked) {
            item["type"] = reg[i].value;
            // console.log(reg[i].value);
            if (reg[i].value === "Regular") {
                item["price"] = document.getElementById("regular").textContent;
            } else if (reg[i].value === "Standard") {
                item["price"] = document.getElementById("standard").textContent;
            } else if (reg[i].value === "Premium") {
                item["price"] = document.getElementById("premium").textContent;
            }
            // select = true;
            break;
        }
    }
    // if (select === false) {
    //     alert("Choose Type");
    // }
    item["total"] = total.textContent;
    item["date"] = new Date().toLocaleDateString();
    item["time"] = new Date().toLocaleTimeString();
    orders.push(item);
    localStorage.setItem("cart", JSON.stringify(orders));
    // alert(JSON.stringify(orders));
    setTimeout(() => {
        choice.style.display = "none";
    }, 500);
}

function decrease() {
    let total = document.getElementById("total-no");
    let no_of_items = Number(total.textContent);
    if (no_of_items > 1) {
        no_of_items--;
        total.textContent = no_of_items;
    }
}

function increase() {
    let total = document.getElementById("total-no");
    let no_of_items = Number(total.textContent);
    if (no_of_items < 100) {
        no_of_items++;
        total.textContent = no_of_items;
    }
}

decreaseBTN.onclick = () => {
    decrease();
};

increaseBTN.onclick = () => {
    increase();
};

function choiceClose() {
    choice.style.display = "none";
}

async function getData() {
    try {
        let response = await fetch("http://localhost:3333/icescoop/icecreams");
        if (!response.ok) {
            container.innerHTML = "<h1>No Icecreams to show now</h1>"
        }
        else {
            let data = await response.json();
            console.log("data fetched successfully");
            let icecreamsArray = data.message;
            icecreamsArray.forEach((icecream) => {

                // console.log(icecream);
                let icecreamDiv = document.createElement("div");
                icecreamDiv.classList.add("card");
                icecreamDiv.style.backgroundImage = `url(${icecream.image})`;

                let details = document.createElement("div");
                icecreamDiv.classList.add("card-details");

                // let image = document.createElement("img");
                // image.classList.add("icecream-image");
                // image.src = `${icecream.image}`;

                let title = document.createElement("p");
                title.classList.add("text-title")
                title.textContent = icecream.name.replaceAll("_", " ");

                // details.appendChild(image);
                details.appendChild(title);

                let addCart = document.createElement("button");
                addCart.classList.add("card-button");
                addCart.textContent = "Check Out";
                addCart.id = icecream.icecream_id;

                icecreamDiv.appendChild(details);
                icecreamDiv.appendChild(addCart);

                container.appendChild(icecreamDiv);

            });


            // Adding the functionality of add to cart
            let addCartButtons = document.querySelectorAll(".card-button");
            addCartButtons.forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    let alertDiv = document.getElementById("alert");
                    if (alertDiv) {
                        // body.removeChild(alertDiv);
                        alertDiv.remove();
                    }
                    let email = localStorage.getItem("userEmail");
                    let exp = localStorage.getItem("exp");
                    if (exp && email) {
                        let icecream_id = e.target.id;
                        // console.log(icecream_id);
                        try {
                            choice.style.display = "none";
                            let response = await fetch(`http://localhost:3333/icescoop/foundicecream/${icecream_id}`);
                            if (!response.ok) {
                                return;
                            } else {
                                let data = await response.json();
                                let icecreamData = data.message;
                                choice_name.textContent = icecreamData[0].name.replaceAll("_", " ");
                                choice_img.src = icecreamData[0].image;
                                choice_description.textContent = icecreamData[0].description;
                                // console.log(icecreamData[0].regular_price);
                                regular.textContent = `${icecreamData[0].regular_price}`;
                                standard.textContent = `${icecreamData[0].standard_price}`;
                                premium.textContent = `${icecreamData[0].premium_price}`;
                                choice.style.display = "flex";
                            }
                        } catch (err) {
                            console.log("something went wrong");
                        }
                    } else {
                        let alertDiv = document.createElement("div");
                        alertDiv.id = "alert";
                        body.prepend(alertDiv);
                        alertDiv.textContent = "Login First to Add to Cart!";
                        setTimeout(() => {
                            alertDiv.remove();
                        }, 2000);
                    }
                });
            });

        }
    } catch (err) {
        console.log(err.message);
    }
}

getData();

async function search() {
    let icecreamName = document.getElementById("sb").value;
    document.getElementById("sb").value = "";
    // let string = "ice scoop special";
    // console.log(string.includes("special"));
    let alertDiv = document.getElementById("alert");
    if (alertDiv) {
        // body.removeChild(alertDiv);
        alertDiv.remove();
    }
    let email = localStorage.getItem("userEmail");
    let exp = localStorage.getItem("exp");
    if (exp && email) {
        try {
            choice.style.display = "none";
            let response = await fetch(`http://localhost:3333/icescoop/foundicecream/name/${icecreamName}`);
            if (!response.ok) {
                let alertDiv = document.createElement("div");
                alertDiv.id = "alert";
                body.prepend(alertDiv);
                alertDiv.textContent = "Nothing Found";
                setTimeout(() => {
                    alertDiv.remove();
                }, 2000);
                return;
            } else {
                let data = await response.json();
                let icecreamData = data.message;
                choice_name.textContent = icecreamData[0].name.replaceAll("_", " ");
                choice_img.src = icecreamData[0].image;
                choice_description.textContent = icecreamData[0].description;
                // console.log(icecreamData[0].regular_price);
                regular.textContent = `${icecreamData[0].regular_price}`;
                standard.textContent = `${icecreamData[0].standard_price}`;
                premium.textContent = `${icecreamData[0].premium_price}`;
                choice.style.display = "flex";
            }
        } catch (err) {
            console.log("something went wrong");
        }
    } else {
        let alertDiv = document.createElement("div");
        alertDiv.id = "alert";
        body.prepend(alertDiv);
        alertDiv.textContent = "Login First to Search";
        setTimeout(() => {
            alertDiv.remove();
        }, 2000);
    }
}

// Cart item increment
function itemIncrement() {

}