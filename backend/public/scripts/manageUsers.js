let admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "/icescoop/error";
}
else {
  document.querySelector("body").style.display = "block";
}

function goAdmin() {
    window.location.href = '/icescoop/admin';
};

let table = document.getElementById('ordersTable');

function addUserData(e) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    td1.textContent = e.id;
    let td2 = document.createElement('td');
    td2.textContent = e.phone;
    let td3 = document.createElement('td');
    td3.textContent = e.email;
    let td4 = document.createElement('td');
    td4.textContent = e.address;
    let td5 = document.createElement('td');
    td5.textContent = e.pin_code;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    table.appendChild(tr);
}

async function addTableData() {
    try {
        let response = await fetch(`https://ice-scoop.onrender.com/icescoop/admin/allusers/${localStorage.getItem("admin")}`);
        if (!response.ok) {
            let wrong = document.createElement("h2");
            wrong.textContent = 'No Users';
            wrong.style.textAlign = "center";
            wrong.id = "no-users";
            document.querySelector("body").appendChild(wrong);
        } else {
            let data = await response.json();
            console.log("data fetched successfully");
            let no_users = document.getElementById("no-users");
            if (no_users) {
                no_users.remove();
            }
            let usersArray = data.message;
            // console.log(usersArray)
            usersArray.forEach((e) => {
                addUserData(e);
            });
        }
    } catch (e) {
        // console.log(e.message);
        alert("Something went wrong");
    }
}
addTableData();

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅