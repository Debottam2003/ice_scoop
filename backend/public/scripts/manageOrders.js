let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}

function goAdmin() {
    window.location.href = '/icescoop/admin';
};

let table = document.getElementById('ordersTable');

function addUserData(e) {

    let tr = document.createElement('tr');

    let td1 = document.createElement('td');
    td1.textContent = e.orders_id;

    let td2 = document.createElement('td');
    td2.textContent = e.user_id;

    let td3 = document.createElement('td');
    td3.textContent = e.date;

    let td4 = document.createElement('td');
    td4.textContent = e.time;

    let td5 = document.createElement('td');
    td5.textContent = e.paymentstatus;

    let td6 = document.createElement("td");
    let details = document.getElementById("button");
    details.textContent = "Details";
    td6.appendChild(details);

    let td7 = document.createElement("td");
    let modify = document.getElementById("button");
    modify.textContent = "Mark Paid";
    td6.appendChild(modify);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);

    table.appendChild(tr);
}

async function getOrdersData() {
    try {
        let response = await fetch(`http://localhost:3333/icescoop/admin/allorders/${localStorage.getItem("admin")}`);
        if (!response.ok) {
            let wrong = document.createElement("h2");
            wrong.textContent = 'No Orders';
            wrong.style.textAlign = "center";
            wrong.id = "no-orders";
            document.querySelector("body").appendChild(wrong);
        } else {
            let data = await response.json();
            console.log("data fetched successfully");
            let no_orders = document.getElementById("no-orders");
            if (no_orders) {
                no_orders.remove();
            }
            let usersArray = data.message;
            // console.log(usersArray)
            usersArray.forEach((e) => {
                addUserData(e);
            });
        }
    } catch (err) {
        console.log("Something went wrong");
    }
}
getOrdersData();

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅