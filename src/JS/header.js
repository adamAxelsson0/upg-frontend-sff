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
        '<button type="submit" onclick="PostRegister()">Register</button>' +
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
async function PostRegister() {
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

    adminDiv.innerHTML = '<div class="admin-options" id="admin-options">' +
        `<button onclick="AddMovieForm()">Add Movie</button>` +
        `<button onclick="SeeRentals()">See Rentals</button>` +
        `<button onclick="VerifyStudios()">Verify Studios</button>` +
        '</div>';


    topnavDiv.insertAdjacentElement("beforeend", adminDiv);
}
function AddMovieForm() {
    mainDiv.innerHTML = '<div class="addMovieInfo"' +
        '<label for="fname">Movie Title:</label>' +
        '<input type="text" id="addMovie-MovieName" name="name" placeholder="...">' +
        '<label for="fname">Stock:</label>' +
        '<input type="number" min=0 max=99 id="addMovie-Stock" name="stock" placeholder="0">' +
        '<button type="submit" onclick="AddMovie()">Add Movie</button>' +
        '</div>';
}
async function AddMovie() {
    try {
        let movieName = document.getElementById('addMovie-MovieName').value;
        let movieStock = document.getElementById('addMovie-Stock').value;

        await fetch('https://localhost:5001/api/film', {
            method: 'POST',
            body: JSON.stringify({
                name: movieName,
                stock: Number(movieStock)
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        alert("Movie was added. Great success!");
        location.reload();

    } catch (error) {
        alert(error);
    }
}
async function SeeRentals() {

    var response = await fetch("https://localhost:5001/api/RentedFilm");
    var rentedFilmData = await response.json();
    response = await fetch("https://localhost:5001/api/film");
    var filmData = await response.json();
    response = await fetch("https://localhost:5001/api/filmstudio");
    var filmStudioData = await response.json();

    mainDiv.innerHTML = '<h1 class="columns-h1">Rentals:</h1>';

    if (rentedFilmData.filter(x => x.returned == false).length == 0) {
        mainDiv.innerHTML +=
            '<p>No rentals currently</p>'
    } else {
            rentedFilmData.filter(x => x.returned == false).forEach(rental => {
            var film = filmData.find(x => x.id == rental.filmId);
            var filmStudio = filmStudioData.find(x => x.id == rental.studioId);
            rental.filmName = film.name;
            rental.studioName = filmStudio.name;

            mainDiv.innerHTML +=
                '<div class="columns">' +
                '<ul class="column">' +
                `<li class="header">Rental</li>` +
                `<li>ID: ${rental.id}</li>` +
                `<li>Movie ID: ${rental.filmId}</li>` +
                `<li>Movie: ${rental.filmName}</li>` +
                `<li>Studio ID: ${rental.studioId}</li>` +
                `<li>Studio: ${rental.studioName}</li>` +
                '</ul>' +
                '</div>'
        });
    }
}
async function VerifyStudios() {
    response = await fetch("https://localhost:5001/api/filmstudio");
    var filmStudioData = await response.json();

    mainDiv.innerHTML = '<h1 class="columns-h1">Studios To Verify:</h1>';

    if (filmStudioData.filter(x => x.verified == false).length == 0) {
        mainDiv.innerHTML +=
            '<p>No studios to verify.</p>'
    } else {
        filmStudioData.filter(x => x.verified == false).forEach(studio => {
            mainDiv.innerHTML +=
                '<div class="columns">' +
                '<ul class="column">' +
                `<li class="header">Studio ${studio.name}</li>` +
                `<li>ID: ${studio.id}</li>` +
                `<li>Name: ${studio.name}</li>` +
                `<li>Password: ${studio.password}</li>` +
                `<li class="footer"><button onclick="StudioVerification(${studio.id})">Verify</button></li>` +
                '</ul>' +
                '</div>'
        });

    }
}
async function StudioVerification(id) {
    try {
        const response = await fetch(`https://localhost:5001/api/filmstudio/${id}`);
        studio = await response.json();
        await fetch(`https://localhost:5001/api/filmstudio/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                id: Number(id),
                name: studio.name,
                password: studio.password,
                verified: true
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        alert("Studio was verified");
        location.reload();

    } catch (error) {
        alert(error);
    }
}