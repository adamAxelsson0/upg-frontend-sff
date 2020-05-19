const mainDiv = document.getElementById("main");
ShowLoginOrLoggedIn();

function ShowLoginOrLoggedIn() {
    if (localStorage.Admin != null) {
        LoggedInAdmin();
        AddAdminOptions();
    }
    else if (localStorage.UserName != null) {
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
        `<p>Hello ${userName}</p>` +
        '</div>';
}
function LoggedInAdmin() {
    const loginDiv = document.getElementById("login");
    userName = localStorage.Admin.userName;
    loginDiv.innerHTML = '<div class="login-container">' +
        '<button type="submit" onclick="Logout()">Logout</button>' +
        `<p>Hello Admin</p>` +
        '</div>';
}
async function Login() {
    let user, password = "";
    var admin = { userName: "admin", pw: "admin" }
    userName = document.getElementById("username").value;
    pw = document.getElementById("pw").value

    if (admin.pw == pw && admin.userName == userName) {
        localStorage.Admin = true;
    }
    else {
        try {
            const response = await fetch("https://localhost:5001/api/filmstudio");
            const data = await response.json();

            data.forEach(user => {
                if (user.password == pw && user.name == userName && user.verified == true) {
                    localStorage.UserName = user.name;
                    localStorage.UserId = user.id;
                }
            });
            if (localStorage.UserName == null) {
                alert("Incorrect login")
            }
        } catch (error) {
            console.log(error);
        }
    }
    location.reload();
    ShowLoginOrLoggedIn();
}
async function Logout() {
    localStorage.clear();
    location.reload();
    ShowLogin();
}


function Register() {
    var modal = document.getElementById("modal-register");
    var span = document.getElementsByClassName("close")[0];
    const registerBody = document.getElementById("modal-body-register");

    registerBody.innerHTML = '<form id="registerForm">' +
        '<input type="text" id="userName" name="name" placeholder="username">' +
        '<input type="password" id="pw" name="password" placeholder="password">' +
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
    try {
        const thisForm = document.getElementById('registerForm');
        const formData = new FormData(thisForm).entries()
        await fetch('https://localhost:5001/api/filmstudio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        alert("Your application has been registered. Please wait for verification. Standard verification handling time is X hours/days. In the future we will add e-mail confirmation");
    } catch (error) {
        alert(error);
        console.log(error);
    }
}
function AddAdminOptions() {
    const topnavDiv = document.getElementById("topnav");
    const adminDiv = document.createElement("div");

    adminDiv.innerHTML = '<div id="admin-options">' +
        `<button onclick="AddMovieForm()">Add Movie</button>` +
        `<button onclick="SeeRentals()">See Rentals</button>` +
        `<button onclick="VerifyStudios()">Verify Studios</button>` +
        '</div>';


    topnavDiv.insertAdjacentElement("beforeend", adminDiv);
}
function AddMovieForm() {
    mainDiv.innerHTML = '<form id="addMovieForm" name="addMovieForm">' +
        '<label for="fname">Movie Title:</label>' +
        '<input type="text" id="addMovie-MovieName" name="name" placeholder="Blade Runner 2049">' +
        '<label for="fname">Stock:</label>' +
        '<input type="number" min=0 max=99 id="addMovie-Stock" name="stock" placeholder="0">' +
        '<button type="submit" onclick="AddMovie()">Add Movie</button>' +
        '</form>';
}
async function AddMovie() {
    try {
        let myForm = document.getElementById('addMovieForm');
        let formData = new FormData(myForm);
        console.log(formData);
        await fetch('https://localhost:5001/api/film', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        alert("Movie was added. Great success!");
    } catch (error) {
        alert(error);
    }
}
async function SeeRentals() {
    const response = await fetch("https://localhost:5001/api/RentedFilm");
    data = await response.json();
    mainDiv.innerHTML = '<h1>Rentals:</h1>';
    data = data.filter(x => x.returned == false);

    data.forEach(element => {
        mainDiv.innerHTML += 
        `<p>Film ID: </p>`+
       `<p>${element.filmId}</p>`+
       `<p>FilmStudio ID: </p>`+
       `<p>${element.studioId}</p>`+
       '<br>'
       ;
    });

}
function VerifyStudios() {

}