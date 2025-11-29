const form = document.getElementById("form");
const search = document.getElementById("search");
const passlist = document.getElementById("password-list");
const passwordInput = document.getElementById("password");
const websiteInput = document.getElementById("website");

let passwordList = [];
let currentSort = "az";

function loadPasswords(){
  const stored = localStorage.getItem("passwordList");
  if(stored){
    passwordList = JSON.parse(stored);
    sort();
  }
}

function savePasswords(){
  localStorage.setItem("passwordList", JSON.stringify(passwordList));
}

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
            <strong>${item.website}</strong>: 
            <span class="password-text" data-id="${item.id}">${"*".repeat(item.password.length)}</span>
            <button data-id="${item.id}" class="show">Show</button>
            <button data-id="${item.id}" class="delete-btn">Delete</button>
            <button data-id="${item.id}" class="copy">Copy</button>
            <button data-id="${item.id}" class="edit">Edit</button>
        `;

        passlist.appendChild(li);
    });

    savePasswords();
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
  
  //This is used so that we know which li we are targeting
  const id = Number(e.target.dataset.id);
  const index = passwordList.findIndex(p => p.id === id);  
  
  //Delete Button
  if (e.target.classList.contains("delete-btn")) {
    passwordList.splice(index, 1);
    sort();
    renderPasswords();
  }

  //Copy Button
  if(e.target.classList.contains("copy")){
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

  //Edit button
  if(e.target.classList.contains("edit")){
    const li = e.target.parentElement;
    const item = passwordList[index];

    li.innerHTML = `
    <input type="text" class="edit-website" value="${item.website}">
    <input type="text" class="edit-password" value="${item.password}">
    <button class="save" data-id="${item.id}">Save</button>
    <button class="cancel">Cancel</button>
    `;
  }

  if(e.target.classList.contains("show") && index != -1){
    const span = e.target.parentElement.querySelector(".password-text");
    if(e.target.textContent === "Show"){
      span.textContent = passwordList[index].password;
      e.target.textContent = "Hide";
    } else{
      span.textContent = "*".repeat(passwordList[index].password.length);
      e.target.textContent = "Show"
    }
  }

  if(e.target.classList.contains("save")){
    const id = Number(e.target.dataset.id);
    const index = passwordList.findIndex(p => p.id === id);
    if(index === -1) return;

    const li = e.target.parentElement;
    const newWebsite = li.querySelector(".edit-website").value.trim();
    const newPassword = li.querySelector(".edit-password").value.trim();

    if(newWebsite !== "" && newPassword !== ""){
      passwordList[index].website = newWebsite;
      passwordList[index].password = newPassword;
      sort();
      renderPasswords();
    }
  }

  if(e.target.classList.contains("cancel")){
    renderPasswords();
  }
});

loadPasswords();
renderPasswords();