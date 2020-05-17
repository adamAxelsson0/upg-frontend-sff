ShowLoginOrLoggedIn();

function ShowLoginOrLoggedIn() {
    if(localStorage.getItem("user") != null){
        LoggedIn();
    }
    else{
        ShowLogin();
    }
}
function ShowLogin(){
    const loginDiv = document.getElementById("login");
    const registerdiv = document.getElementById("register");

    loginDiv.innerHTML = 
    '<div class="login-container">'+
     `<button onclick="Register()">Register</button>` +
         '<div id="modal-register" class="modal">' +
         '<div class="modal-content">'+
         '<div class="modal-header">'+
           '<span class="close">&times;</span>'+
           `<h2>Register account</h2>`+
         '</div>'+
         '<div id="modal-body-register" class="modal-body">'+
            
         '</div>'+
       '</div>'+
         '</div>'+
      '<input type="text" placeholder="Username" id="username">'+
      '<input type="password" placeholder="Password" id="pw">'+
      '<button type="submit" onclick="Login()">Login</button>'+
     '</div>';
}
function LoggedIn(){
    const loginDiv = document.getElementById("login");
    loginDiv.innerHTML = "";

    loginDiv.insertAdjacentElement("beforeend" , '<div class="login-container">'+
    '<button type="submit" onclick="Logout()">Logout</button>'+
    `<p>Logged in as ${localStorage.getItem("user")}</p>`+
    '</div>');

}
async function Login(){
    let user, password ="";
    userName = document.getElementById("username").value;
    pw = document.getElementById("pw").value
    
    try {
        const response = await fetch("https://localhost:5001/api/filmstudio");
        const data = await response.json();

        data.forEach(user => {
            if(user.password == pw && user.name == userName){
                localStorage.setItem("user", user);
                console.log("got here");
            }
        });
        if(localStorage.getItem("user") == null){
            console.log("wrong login")
        }
        ShowLoginOrLoggedIn();
    } catch (error) {
        console.log(error);
    }
}
async function Logout() {
    localStorage.removeItem("user");
    ShowLogin();
}


async function Register() {
    var modal = document.getElementById("modal-register");
    var span = document.getElementsByClassName("close")[0];
    const registerBody = document.getElementById("modal-body-register");

    registerBody.innerHTML = '<input type="text" placeholder="Enter Username" id="uname" required>'+
    '<input type="password" placeholder="Enter Password" id="psw" required>'+
    '<button type="submit" onclick="TryRegister()">Register</button>';

    modal.style.display = "block";

    span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
async function TryRegister(){
    var userName = document.getElementById("uname").value;
    var passWord = document.getElementById("psw").value;
    var filmstudio =  { name: userName, password: passWord, verified: false};
    console.log(filmstudio)
    try {
        let response = await fetch('https://localhost:5001/api/filmstudio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(filmstudio)
          });
          
          let result = await response.json();
          alert(result.name + " has been registered and is waiting approval.");

        const registerBody = document.getElementById("modal-body-register");
        registerBody.innerHTML = "<p>Your account is waiting approval</p>";

    } catch (error) {
        
    }
}