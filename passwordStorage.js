const form = document.getElementById("form");
const search = document.getElementById("search");
const passlist = document.getElementById("password-list");
const passwordInput = document.getElementById("password");
const websiteInput = document.getElementById("website");

let passwordList = [];
let currentSort = "az";

function sortAZ(){
  passwordList.sort((a, b) => a.website.localeCompare(b.website));
};

function sortZA(){
  passwordList.sort((a, b) => b.website.localeCompare(a.website));
}


function passwordHide(l){
    return "*".repeat(l.length);
}

//Creates an li item in the unordered list and then appends it to passlist(aka the ul)
function renderPasswords(){
    passlist.innerHTML = "";
   
    passwordList.forEach((item) =>{
        const li = document.createElement("li");

        li.innerHTML = `<strong>${item.website}</strong>: ${item.password}
        <button data-id="${item.id}" class="delete-btn">Delete</button>
        <button data-id="${item.id}" class="copy">Copy</button>
        `;

        passlist.appendChild(li);
    });
}


document.getElementById("sort").addEventListener("click", function(){
  if(this.value === "az"){
    sortAZ();
    currentSort = "az";
  } else if(this.value === "za"){
    sortZA();
    currentSort = "za";
  }
  renderPasswords();
});


form.addEventListener("submit", function(e){
    e.preventDefault();

    const website = websiteInput.value.trim();
    const password = passwordInput.value.trim();

    if(website === "" || password === ""){
        alert("Please fill out both fields");
        return;
    }

    passwordList.push({
        id: Date.now(),
        website: website, 
        password: password
    });

    websiteInput.value = "";
    passwordInput.value = "";

    if(currentSort === "az"){
      sortAZ();
    } else if(currentSort === "za"){
      sortZA();
    }
    renderPasswords();
});

passlist.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    const index = passwordList.findIndex(p => p.id === id);
    passwordList.splice(index, 1);
    renderPasswords();
  }
  if(e.target.classList.contains("copy")){
    const id = Number(e.target.dataset.id);
    const index = passwordList.findIndex(p => p.id === id);
    const t = passwordList[index];
    navigator.clipboard.writeText(t["password"]);
    
    const tooltip = document.createElement("span");
    tooltip.textContent = "Copied!";
    tooltip.className = "copy-tooltip"; 
    e.target.parentElement.appendChild(tooltip);
    
    setTimeout(() => {
      tooltip.remove();
    }, 1500);

  }
});