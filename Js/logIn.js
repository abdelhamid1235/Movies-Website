let container = document.querySelector(".container");
let loginFiled = document.querySelector(".login");
let signupFiled = document.querySelector(".signup");
let pwShowHide = document.querySelectorAll(".showHidePw");
let pwFields = document.querySelectorAll(".password");
let signUp = document.querySelector(".signup-link");
let login = document.querySelector(".login-link");

// show/hide password
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("fa-eye-slash", "fa-eye");
        });
      } else {
        pwField.type = "password";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("fa-eye", "fa-eye-slash");
        });
      }
    });
  });
});
//signup and login form
signUp.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("active");
  document.querySelector(".login .message").innerText = "";
});
login.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("active");
  document.querySelectorAll(".signup .valid-mess").forEach(e => e.innerHTML="");
  document.querySelectorAll(".signup input").forEach(input => {
    input.classList.remove("is-valid","is-invalid");
  });
  document.querySelector(".signup .message").innerText = "";
});
loginFiled.addEventListener("submit", function(e){
  e.preventDefault();
  let email = document.querySelector(".login input[name='Email']").value;
  let password = document.querySelector(".login input[name='Password']").value;
  let loc = JSON.parse(localStorage.getItem("users")) || [];
  let found = false;
  for(let i = 0; i < loc.length; i++){
    if(loc[i].email === email && loc[i].password === password){
      found = true;
      break;
    }
  }
  if(found){
    document.querySelector(".login .message").style.cssText = "color: green; text-align: center; padding: 10px;font-size:20px";
    document.querySelector(".login .message").innerText = "Login successful!";
    sessionStorage.setItem("correctLogin","true");
    setTimeout(()=>{
      window.location.href = "../index.html";
    },1000);
  } else {
    document.querySelector(".login .message").style.cssText = "color: red; text-align: center; padding: 10px;font-size:20px";
    document.querySelector(".login .message").innerText = "Invalid email or password!";
  }
  clear();
});
signupFiled.addEventListener("submit", function(e){
  e.preventDefault();

  let firstName = document.querySelector(".signup input[name='FirstName']").value.trim();
  let lastName  = document.querySelector(".signup input[name='LastName']").value.trim();
  let email     = document.querySelector(".signup input[name='Email']").value.trim();
  let password  = document.querySelector(".signup input[name='Password']").value.trim();
  let name = `${firstName} ${lastName}`;

  let nameRegex     = /^[a-zA-Z ]{5,20}$/;
  let emailRegex    = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{3,6}$/;
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/;
  if(!nameRegex.test(firstName) || !nameRegex.test(lastName)  || !emailRegex.test(email)    ||!passwordRegex.test(password)){
    showMessage(".signup .message","Please fix validation errors first!","red");
    return;
  }
  let user = { name, email, password };
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let exists = users.some(u => u.email === email);
  if(exists){
    showMessage(".signup .message","Account already exists!","red");
    return;
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  showMessage(".signup .message","Account created successfully!","green");
  setTimeout(()=>{
    container.classList.remove("active");
  },1000);
  clear();
});
function showMessage(selector,text,color){
  let msg = document.querySelector(selector);
  msg.style.cssText = `color:${color};text-align:center;padding:10px;font-size:20px`;
  msg.innerText = text;
}

function clear(){
  document.querySelectorAll(".signup input").forEach(input => {
    input.value = "";
    input.classList.remove("is-valid","is-invalid");
  });
}

let FirstNameInput =document.querySelector('[name="FirstName"]');
let LastNameInput =document.querySelector('[name="LastName"]');
let emailInput =document.querySelector('.signup [name="Email"]');
let PasswordInput =document.querySelector('.signup [name="Password"]');

const validateInput = (input, regex, errorElementId, message) => {
  const errorElement = document.getElementById(errorElementId);
  if (!regex.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorElement.innerHTML = `
      <div style="color:red; font-size:16px;">
        <i class="fa-solid fa-circle-exclamation"></i>
        ${message}
      </div>
    `;
  } else {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    errorElement.innerHTML = "";
    }
};
FirstNameInput.addEventListener("blur",()=>
  validateInput(FirstNameInput,/^[a-zA-Z ]{5,20}$/,"validationFirstName","Name is not valid"),
);
LastNameInput.addEventListener("blur",()=>
  validateInput(LastNameInput,/^[a-zA-Z ]{5,20}$/,"validationLastName","Name is not valid")
);
emailInput.addEventListener("blur",()=>
  validateInput(emailInput,/^[^\s@]+@[^\s@]+\.[a-zA-Z]{3,6}$/,"validationEmail","Email is not valid")
);
PasswordInput.addEventListener("blur",()=>
  validateInput(PasswordInput,/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/,"validationPass","Password must be at least 8 characters and include uppercase, lowercase, number and special character.")

);
