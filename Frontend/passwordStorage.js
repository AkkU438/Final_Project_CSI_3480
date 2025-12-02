const form = document.getElementById("form");
const search = document.getElementById("search");
const passlist = document.getElementById("password-list");
const passwordInput = document.getElementById("password");
const websiteInput = document.getElementById("website");

let passwordList = [];
let currentSort = "az";

// Get token from localStorage, redirect to login if not found
const token = localStorage.getItem('authToken');
if (!token) {
  window.location.href = 'login.html';
}


async function loadPasswords() {
  try {
    const res = await fetch('http://localhost:5000/api/passwords', {
      headers: {'x-auth-token': token}
    });
    
    if (res.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      window.location.href = 'login.html';
      return;
    }
    
    if (!res.ok) {
      throw new Error(`Failed to load passwords: ${res.status}`);
    }
    
    passwordList = await res.json();
    renderPasswords();
  } catch (err) {
    console.error('Failed to load passwords:', err);
    alert('Failed to load passwords. Please try again.');
  }
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
            <strong>${item.website}:</strong> 
            <span class="password-text" data-id="${item._id}">${"*".repeat(12)}</span>
            <button data-id="${item._id}" class="show">Show</button>
            <button data-id="${item._id}" class="delete-btn">Delete</button>
            <button data-id="${item._id}" class="copy">Copy</button>
            <button data-id="${item._id}" class="edit">Edit</button>
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


form.addEventListener("submit", async function(e){
    e.preventDefault();

    const website = websiteInput.value.trim();
    const password = passwordInput.value.trim();

    if(website === "" || password === ""){
        alert("Please fill out both fields");
        return;
    }

    try {

      const res = await fetch('http://localhost:5000/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({website, password })
      });

      if (res.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
        return;
      }

      if (!res.ok) {
        const error = await res.json();
        alert(error.msg || 'Failed to add password');
        return;
      }

      const newEntry = await res.json();
      passwordList.push(newEntry);
      
      sort();
      renderPasswords();

      websiteInput.value = "";
      passwordInput.value = "";
    } catch (err) {
      console.error('Failed to add password:', err);
      alert('Failed to add password. Please try again.');
    }
});


passlist.addEventListener("click", async function (e) {
  
  //This is used so that we know which li we are targeting
  const id = e.target.dataset.id;
  const index = passwordList.findIndex(p => p._id === id);  
  console.log(index);
  
  //Delete Button
  if (e.target.classList.contains("delete-btn")) {
    try {
      const res = await fetch(`http://localhost:5000/api/passwords/${passwordList[index]._id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token}
      });

      if (res.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete password');
      }

      passwordList.splice(index, 1);
      renderPasswords();
    } catch (err) {
      console.error('Failed to delete password:', err);
      alert('Failed to delete password. Please try again.');
    }
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
    <button class="save" data-id="${item._id}">Save</button>
    <button class="cancel">Cancel</button>
    `;
  }

  if(e.target.classList.contains("show") && index != -1){
    const span = e.target.parentElement.querySelector(".password-text");
    if(e.target.textContent === "Show"){
      span.textContent = passwordList[index].password;
      e.target.textContent = "Hide";
    } else{
      span.textContent = "*".repeat(12);
      e.target.textContent = "Show"
    }
  }

  if(e.target.classList.contains("save")){
     const li = e.target.parentElement;
    const newWebsite = li.querySelector(".edit-website").value.trim();
    const newPassword = li.querySelector(".edit-password").value.trim();
    const id = e.target.dataset.id;
    const index = passwordList.findIndex(p => p._id === id);

    if (!newWebsite || !newPassword) return;
    try {

      const res = await fetch(`http://localhost:5000/api/passwords/${passwordList[index]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ website: newWebsite, password: newPassword })
      });

      if (res.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
        return;
      }

      if (!res.ok) {
        const error = await res.json();
        alert(error.msg || 'Failed to update password');
        return;
      }

      const updated = await res.json();
      passwordList[index] = updated;
      renderPasswords();
    } catch (err) {
      console.error('Failed to update password:', err);
      alert('Failed to update password. Please try again.');
    }
  }

  if(e.target.classList.contains("cancel")){
    renderPasswords();
  }
});

// Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
});

loadPasswords();
renderPasswords();