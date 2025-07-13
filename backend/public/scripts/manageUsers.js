function goAdmin(){
    window.location.href='/icescoop/admin';
};

let table = document.getElementById(ordersTable);

function addUserData(e){
    let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.textContent;
        let td2 = document.createElement('td');
        td2.textContent;
        let td3 = document.createElement('td');
        td3.textContent;
        let td4 = document.createElement('td');
            let button = document.createElement('button');
            button.classList.add('d');
            button.textContent = "DELETE";
        td4.appendChild(button);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    
    table.appendChild(tr);
}

async function addTableData(){
    try{
        let response = await fetch(`http://localhost/icescoop/admin/alluser/samratkarmakarnaihati@icescoop.com`);
        if(!response.ok){
            table.innerHTML='<h2>Zero Users</h2>';
        }else{
            let data = await response.json();
            console.log("data fetched successfully");
            let usersArray = data.message;
            console.log(usersArray)
            usersArray.forEach((e) => {
                addUserData(e);   
            });
        }
    }catch(e){
        console.log(e.message);
    }
}
addTableData();