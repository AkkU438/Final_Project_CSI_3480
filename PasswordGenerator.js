/*Alright so here are the values that we are gonna be using for the password*/ 
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";


function generatePassword(length){
    //Checks what buttons are clicked
    const checkUpper = document.getElementById("value1").checked;
    const checkLower = document.getElementById("value2").checked;
    const checkNumber = document.getElementById("value3").checked;
    const checkSymbols = document.getElementById("value4").checked;

    /*Strings, kept inside cause 
    when outside different passwords keep 
    getting appended to it*/
    let password = "";
    let chars = "";

    //Checks and appends certain strings
    if(!checkUpper && !checkLower && !checkNumber && !checkSymbols){
        chars += uppercase;
        document.getElementById("value1").checked = true;
    } else{
        if(checkUpper) chars += uppercase;
        if(checkLower) chars += lowercase;
        if(checkNumber) chars += numbers;
        if(checkSymbols) chars += symbols;
    }


    //Creates the new array to use for the password
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    //For loop used to make the password
    for(let i = 0; i < length; i++){
    const randIndex = array[i] % chars.length;
    password += chars[randIndex];
    }
    return password;
}

const slider = document.getElementById("slider");
const output = document.getElementById("output");
const p = document.getElementById("password");
const gen = document.getElementById("generate");
const copy = document.getElementById("copy");

p.textContent = generatePassword(12);

copy.addEventListener("click", ()=>{
    navigator.clipboard.writeText(p.textContent);
    alert("password copied");
})
slider.addEventListener("input", ()=>{
    output.textContent = slider.value;
    p.textContent = generatePassword(slider.value);
})
gen.addEventListener("click", ()=> {
    p.textContent = generatePassword(slider.value);
})