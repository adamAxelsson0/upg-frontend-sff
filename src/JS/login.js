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
         '<div id="modal" class="modal">' +
         '<div class="modal-content">'+
         '<div class="modal-header">'+
           '<span class="close">&times;</span>'+
           `<h2>Register account</h2>`+
         '</div>'+
         '<div id="modal-body" class="modal-body">'+
            
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

    loginDiv.insertAdjacentHTML("afterbegin" , '<div class="login-container">'+
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
    var modal = document.getElementById("modal");
    var span = document.getElementsByClassName("close")[0];
    const triviaBody = document.getElementById("modal-body");


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