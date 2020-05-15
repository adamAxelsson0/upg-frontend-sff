GetMovies();
ShowLoginOrLoggedIn();
const mainDiv = document.getElementById("main");

async function GetMovies() {
    try {
        const response = await fetch("https://localhost:5001/api/film");
        const data = await response.json();

        const movieDiv = document.getElementById("movieList");

        data.forEach(movie => {
            if(movie.description == null){
                movie.description = "Noun. placeholder (plural placeholders) Something"+
                "used or included temporarily or as a substitute for something that "+
                "is not known or must remain generic; that which holds, denotes or "+
                "reserves a place for something to come later."
            }
            let movieCard = document.createElement("div");
            movieCard.innerHTML = 
            "<div class=\"card\">" +
                "<img src=\"https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png\" style=\"width:100%\" >" +
                    "<div class=\"container\">" +
                        `<h2><b>${movie.name}</b></h2>` +
                        `<p>${movie.description}</p>` +
                        `<p>In stock: ${movie.stock}</p>` +
                    "</div>" +
                    "<div class=\"card-footer\">"+
                        `<a href='http://127.0.0.1:5500/src/Pages/trivia.html?movie=${movie.id}' class='button'>Trivia</a>`
                        "<small class=\"text-muted\">Last updated x mins ago</small>"+
                    "</div>"
            "</div>"+
            movieDiv.insertAdjacentElement("beforeend", movieCard);
        });
    } catch (error) {
        console.log(error);
    }
}

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