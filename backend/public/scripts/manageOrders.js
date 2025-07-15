let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}
else {
  document.querySelector("body").style.display = "block";
}

function goAdmin() {
    window.location.href = "/icescoop/admin";
}

let table = document.getElementById("ordersTable");

function addOrderData(e) {
    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    td1.textContent = e.orders_id;

    let td2 = document.createElement("td");
    td2.textContent = e.user_id;

    let td3 = document.createElement("td");
    td3.textContent = e.date;

    let td4 = document.createElement("td");
    td4.textContent = e.time;

    let td5 = document.createElement("td");
    td5.textContent = e.paymentstatus;

    let td6 = document.createElement("td");
    let details = document.createElement("button");
    details.textContent = "Details";
    details.classList.add("details");
    details.id = e.orders_id;
    td6.appendChild(details);

    // let td7 = document.createElement("td");
    // let modify = document.createElement("button");
    // modify.textContent = "Mark Paid";
    // modify.classList.add("modify");
    // modify.id = e.orders_id;
    // td7.appendChild(modify);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    // tr.appendChild(td7);

    table.appendChild(tr);
}

async function getOrdersData() {
    try {
        let response = await fetch(
            `https://ice-scoop.onrender.com/icescoop/admin/allorders/${localStorage.getItem(
                "admin"
            )}`
        );
        if (!response.ok) {
            let wrong = document.createElement("h2");
            wrong.textContent = "No Orders";
            wrong.style.textAlign = "center";
            wrong.id = "no-orders";
            document.querySelector("body").appendChild(wrong);
        } else {
            let data = await response.json();
            // console.log("data fetched successfully");
            let no_orders = document.getElementById("no-orders");
            if (no_orders) {
                no_orders.remove();
            }
            let usersArray = data.message;
            // console.log(usersArray)
            usersArray.forEach((e) => {
                addOrderData(e);
            });

            let detailsBTN = document.querySelectorAll(".details");
            detailsBTN.forEach((detail) => {
                detail.addEventListener("click", async (e) => {
                    // alert("clicked");
                    try {
                        // Hide the modal first
                        document.getElementById("floating-details").style.display = "none";

                        // Fetch order details
                        let response = await fetch(
                            `https://ice-scoop.onrender.com/icescoop/admin/detailedorder/${localStorage.getItem(
                                "admin"
                            )}/${e.target.id}`
                        );

                        if (!response.ok) {
                            alert("Something went wrong");
                        } else {
                            let data = await response.json();
                            let details = data.message; // should be an array of objects

                            // Show the modal
                            let floating_details =
                                document.getElementById("floating-details");
                            floating_details.style.display = "block";

                            // Clear previous content
                            let display = document.getElementById("display-order-detail");
                            display.innerHTML = "";

                            // Build HTML from each object
                            details.forEach((order, index) => {
                                display.innerHTML += `
                                        <div class="order-card">
                                        <div class="order-title">Item ${index + 1}</div>
                                        <div class="order-content">
                                        ${Object.entries(order)
                                        .map(
                                            ([key, value]) =>
                                                `<div class="order-field"><strong>${key}:</strong> ${value}</div>`
                                        )
                                        .join("")}
                                        </div>
                                        </div>
                                        `;
                            });
                            if (data.total_price !== "Already Paid") {
                                display.innerHTML += `<h2>Total: ${data.total_price}</h2>`;
                                display.innerHTML += `<button class="payment" id=${e.target.id}>Mark Paid</button>`;
                                let pay = document.querySelector(".payment");
                                pay.addEventListener("click", async (e) => {
                                    let order_id = e.target.id;
                                    // alert(order_id);
                                    // console.log(order_id);
                                    let sure = confirm("Are you sure?");
                                    if (sure) {
                                        try {
                                            let response = await fetch(`https://ice-scoop.onrender.com/icescoop/admin/markpaid/${localStorage.getItem("admin")}/${e.target.id}`);
                                            if (!response.ok) {
                                                alert("Something went wrong");
                                            } else {
                                                window.location.reload(1);
                                            }
                                        } catch (err) {
                                            // console.log(err.message);
                                            alert("Something went wrong");
                                        }
                                    }
                                });
                            } else {
                                display.innerHTML += `<h2>${data.total_price}</h2>`;
                            }
                        }
                    } catch (err) {
                        // console.log(err.message);
                        alert("Something went wrong");
                    }
                });
            });
        }
    } catch (err) {
        // console.lo(err.message);
        alert("Something went wrong");
    }
}
getOrdersData();

document.getElementById("close").onclick = () => {
    document.getElementById("floating-details").style.display = "none";
};

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
