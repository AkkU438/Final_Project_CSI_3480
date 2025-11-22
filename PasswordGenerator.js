const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
let password = "";

const length = 12;
const array = new Uint32Array(length);
window.crypto.getRandomValues(array);

const p = document.getElementById("password");


for(let i = 0; i < length; i++){
    const randIndex = array[i] % chars.length;
    password += chars[randIndex];
}

p.textContent = password;
console.log(password);