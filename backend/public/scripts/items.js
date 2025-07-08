function Goback() {
    window.location.href='/icescoop';
}

let container = document.getElementById("items-container");

async function getData() {
    try{
        let response = await fetch("http://192.168.18.119:3333/icescoop/icecreams");
        if(!response.ok) {
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
                addCart.textContent = "Add To Cart";

                icecreamDiv.appendChild(details);
                icecreamDiv.appendChild(addCart);

                container.appendChild(icecreamDiv);

            });
        }
    } catch(err) {
        console.log(err.message);
    }
}

getData();