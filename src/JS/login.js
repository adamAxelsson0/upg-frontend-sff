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

    loginDiv.innerHTML = 
    '<div class="login-container">'+
      '<input type="text" placeholder="Username" id="username">'+
      '<input type="password" placeholder="Password" id="pw">'+
      '<button type="submit" onclick="Login()">Login</button>'+
     '</div>'
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