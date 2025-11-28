const form = document.getElementById("form");
const search = document.getElementById("search");
const passlist = document.getElementById("password-list");
const passwordInput = document.getElementById("password");
const websiteInput = document.getElementById("website");

let passwordList = [];
let currentSort = "az";

function sort(){
  if(currentSort === "az"){
    passwordList.sort((a, b) => a.website.localeCompare(b.website));
  } else if(currentSort === "za"){
    passwordList.sort((a, b) => b.website.localeCompare(a.website));
  }
}

function passwordHide(l){
  return "*".repeat(l.length);
}


function renderPasswords(){
    passlist.innerHTML = "";
   
    const query = search.value.toLowerCase();

    const filtered = passwordList.filter(item =>
        item.website.toLowerCase().includes(query)
    );

    filtered.forEach(item => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${item.website}</strong>: ${item.password}
            <button data-id="${item.id}" class="delete-btn">Delete</button>
            <button data-id="${item.id}" class="copy">Copy</button>
        `;

        passlist.appendChild(li);
    });
}

search.addEventListener("input", () =>{
  renderPasswords();
});

document.getElementById("sort").addEventListener("change", function(){
  if(this.value === "az"){
    currentSort = "az";
    sort();
  } else if(this.value === "za"){
    currentSort = "za";
    sort();
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

    sort();
    renderPasswords();
});


passlist.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    const index = passwordList.findIndex(p => p.id === id);
    passwordList.splice(index, 1);
    sort();
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