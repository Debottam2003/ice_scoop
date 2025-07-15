function Goback() {
    window.location.href = "/icescoop/flavours";
}
function GoAcc() {
    window.location.href = "/icescoop/account";
}

let orderSection = document.getElementById('orders-section');

function updateOrders(order) {

    let orderItem = document.createElement('div');
    orderItem.classList.add('order-item');

    let orderID = document.createElement('div');
    orderID.classList.add('order-id')
    orderID.textContent = `OID: ${order.orderid}`;
    // console.log(order.orderid);

    let itemImg = document.createElement('img');
    itemImg.classList.add('item-img')
    itemImg.src = order.image;

    let itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.textContent = order.name;

    let itemNo = document.createElement('div');
    itemNo.classList.add('item-no');
    itemNo.textContent = order.quantity;

    let itemQuantity = document.createElement('div');
    itemQuantity.classList.add('item-quantity');
    itemQuantity.textContent = order.type.toUpperCase();

    let itemCost = document.createElement('div');
    itemCost.classList.add('item-cost');
    itemCost.textContent = order.price;

    let orderDate = document.createElement('div');
    orderDate.classList.add('item-date');
    orderDate.textContent = "Date " + order.date;

    orderItem.appendChild(orderID);
    orderItem.appendChild(itemImg);
    orderItem.appendChild(itemName);
    orderItem.appendChild(itemNo);
    orderItem.appendChild(itemQuantity);
    orderItem.appendChild(itemCost);
    orderItem.appendChild(orderDate);

    orderSection.appendChild(orderItem);

}
async function getOrders() {
    try {
        let response = await fetch(`https://ice-scoop.onrender.com/icescoop/orderData/${localStorage.getItem('userEmail')}`);
        if (!response.ok) {
            let data = await response.json();
            // console.log(data.message);
            orderSection.innerHTML = '<h2>No Orders Till Now...</h2>';
        } else {
            let data = await response.json();
            // console.log(data.message);
            console.log("data fetched successfully");

            let ordersArray = data.message;

            ordersArray.forEach((order) => {
                updateOrders(order);
            });
        }
    } catch (err) {
        // console.log(err.message);
        alert("something went wrong");
    }
}
getOrders();

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅