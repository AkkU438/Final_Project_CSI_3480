const form = document.getElementById("form");
const search = document.getElementById("search");
const passlist = document.getElementById("password-list");
const passwordInput = document.getElementById("password");
const websiteInput = document.getElementById("website");

let passwordList = [];

function renderPasswords(){
    passlist.innerHTML = "";

    passwordList.forEach((item, index) =>{
        const li = document.createElement("li");

        li.innerHTML = `<strong>${item.website}</strong>: ${item.password}
        <button data-index="${index}" class="delete-btn">Delete</button>
        `;

        passwordList.appendChild(li);
    });

    attachDeleteEvents();
}

form.addEventListener("submit", function(e){
    e.preventDefault();

    const website = websiteInput.value.trim();
    const password = passwordInput.value.trim();

    if(website === "" || password === ""){
        alert("Please fill out both fields");
        return;
    }
})