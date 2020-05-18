ShowLoginOrLoggedIn();

function ShowLoginOrLoggedIn() {
    if (localStorage.UserName != null) {
        LoggedIn();
    }
    else {
        ShowLogin();
    }
}
function ShowLogin() {
    const loginDiv = document.getElementById("login");
    const registerdiv = document.getElementById("register");

    loginDiv.innerHTML =
        '<div class="login-container">' +
        `<button onclick="Register()">Register</button>` +
        '<div id="modal-register" class="modal">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span class="close">&times;</span>' +
        `<h2>Register account</h2>` +
        '</div>' +
        '<div id="modal-body-register" class="modal-body">' +

        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" placeholder="Username" id="username">' +
        '<input type="password" placeholder="Password" id="pw">' +
        '<button type="submit" onclick="Login()">Login</button>' +
        '</div>';
}
function LoggedIn() {
    const loginDiv = document.getElementById("login");
    userName = localStorage.UserName;
    loginDiv.innerHTML = '<div class="login-container">' +
        '<button type="submit" onclick="Logout()">Logout</button>' +
        `<p>Logged in as ${userName}</p>` +
        '</div>';
}
async function Login() {
    let user, password = "";
    userName = document.getElementById("username").value;
    pw = document.getElementById("pw").value

    try {
        const response = await fetch("https://localhost:5001/api/filmstudio");
        const data = await response.json();

        data.forEach(user => {
            if (user.password == pw && user.name == userName && user.verified == true) {
                localStorage.UserName = user.name;
                localStorage.Id = user.id;
            }
        });
        if (localStorage.UserName == null) {
            console.log("wrong login")
        }
        ShowLoginOrLoggedIn();
    } catch (error) {
        console.log(error);
    }
}
async function Logout() {
    localStorage.clear();
    ShowLogin();
}


async function Register() {
    var modal = document.getElementById("modal-register");
    var span = document.getElementsByClassName("close")[0];
    const registerBody = document.getElementById("modal-body-register");

    registerBody.innerHTML = '<form id="registerForm">' +
        '<label for="userName">Name of Studio:</label>' +
        '<input type="text" id="userName" name="name">' +
        '<br>' +
        '<label for="pw">Password:</label>' +
        '<input type="password" id="pw" name="password">' +
        '<br>' +
        '<button type="submit" onclick="TryRegister()">Register</button>' +
        '</form>';

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
async function TryRegister() {
        const thisForm = document.getElementById('registerForm');
        const formData = new FormData(thisForm).entries()
        const response = await fetch('https://localhost:5001/api/filmstudio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        alert("Your application has been registered. Please wait for verification. Standard verification handling time is X hours/days.");
}