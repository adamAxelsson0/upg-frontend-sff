GetMovies();
async function GetMovies() {
    try {
        const responseRental = await fetch("https://localhost:5001/api/RentedFilm");
        const rentedData = await responseRental.json();
        const response = await fetch("https://localhost:5001/api/film");
        const data = await response.json();
        const movieDiv = document.getElementById("movieList");

        data.forEach(movie => {
            if (movie.description == null) {
                movie.description = "Noun. placeholder (plural placeholders) Something" +
                    "used or included temporarily or as a substitute for something that " +
                    "is not known or must remain generic; that which holds, denotes or " +
                    "reserves a place for something to come later."
            };
            let movieCard = document.createElement("div");
            movieCard.innerHTML =
                "<div class=\"card\">" +
                "<img src=\"https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png\" style=\"width:100%\" >" +
                "<div class=\"container\">" +
                `<h2><b>${movie.name}</b></h2>` +
                `<p>${movie.description}</p>` +
                `<p>In stock: ${movie.stock}</p>` +
                "</div>" +
                '<div id="card-footer"class="card-footer">' +
                `<button onclick="ShowModal('${movie.name}');ShowTrivia(${movie.id});">Trivia</button>`;

            if (localStorage.UserName != null) {
                rentedDataFiltered = rentedData.filter(x => x.filmId == movie.id && x.studioId == localStorage.UserId && x.returned == false);
                movieCard.innerHTML += `<button onclick="ShowModal('${movie.name}');ShowAddTrivia(${movie.id});">Add Trivia</button>`;

                if (rentedDataFiltered.length == 0) {
                    movieCard.innerHTML += `<button onclick="Rent(${movie.id});">Rent</button>`;
                }
                else {
                    movieCard.innerHTML += `<button onclick="ReturnRental(${movie.id});">Return Rental</button>`;
                }
            };
            movieCard.innerHTML +=
                "</div>" +

                '<div id="modal-trivia" class="modal">' +
                //Modal goes here
                '</div>' +
                "</div>";
            movieDiv.insertAdjacentElement("beforeend", movieCard);
        });
    } catch (error) {
        console.log(error);
    }
}
function ShowModal(movieName) {
    var modal = document.getElementById("modal-trivia");
    modal.innerHTML =
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span class="close">&times;</span>' +
        `<h2>${movieName}</h2>` +
        '</div>' +
        '<div id="modal-body-trivia" class="modal-body">' +

        '</div>' +
        '</div>';
}
async function ShowTrivia(id) {
    const response = await fetch("https://localhost:5001/api/filmTrivia");
    var data = await response.json();

    var modal = document.getElementById("modal-trivia");
    var span = document.getElementsByClassName("close")[0];
    const triviaBody = document.getElementById("modal-body-trivia");

    data.filter(x => x.filmId == id).forEach(trivia => {
        triviaBody.insertAdjacentHTML("afterbegin", '<div class="card">' +
            `<p>${trivia.trivia}</p>` +
            '</div>')
    });

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function ShowAddTrivia(id) {
    var modal = document.getElementById("modal-trivia");
    var span = document.getElementsByClassName("close")[0];
    const triviaBody = document.getElementById("modal-body-trivia");

    triviaBody.innerHTML = '<form id="triviaForm">' +
        '<textarea rows="4" cols="50" name="trivia" form="usrform" id="triviaText" placeholder="add text here"></textarea>' +
        `<button type="submit" onclick="AddTrivia(${id})">Add Trivia</button>` +
        '</form>';

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
async function AddTrivia(id) {
    const triviaText = document.getElementById('triviaText').value;
    await fetch('https://localhost:5001/api/filmTrivia', {
        method: 'POST',
        body: JSON.stringify({
            "filmid": Number(localStorage.UserId),
            "trivia": triviaText,
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    alert("Your trivia was added");
}
async function Rent(filmid) {
    //Check again if movie is in stock
    const response = await fetch("https://localhost:5001/api/film");
    var movies = await response.json();
    movies.forEach(element => {
        console.log(element)
    });
    movies = movies.filter(x => x.id == filmid && x.stock > 0)

    if (movies.length > 0) {
        await fetch('https://localhost:5001/api/RentedFilm', {
            method: 'POST',
            body: JSON.stringify({
                filmId: Number(filmid),
                studioId: Number(localStorage.UserId)

            }),
            headers: { 'Content-Type': 'application/json' }
        });
        await fetch('https://localhost:5001/api/film', {
            method: 'PUT',
            body: JSON.stringify({
                id: Number(filmid),
                name: movies[0].name,
                stock: Number(movies[0].stock)
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        alert("Movie has been successfully rented");
        location.reload();
    }
    else{
        alert("Movie is not in stock");
    }

}
async function ReturnRental(filmid) {
    const response = await fetch("https://localhost:5001/api/RentedFilm");
    var rentedData = await response.json();
    rentedDataFiltered = rentedData.filter(x => x.filmId == filmid && x.studioId == localStorage.UserId && x.returned == false);
    rental = rentedDataFiltered[0];
    rental.returned = true;
    console.log(rental);

    await fetch('https://localhost:5001/api/RentedFilm', {
        method: 'PUT',
        body: JSON.stringify(rental),
        headers: { 'Content-Type': 'application/json' }
    });
    alert("Movie has been successfully been returned");
    location.reload();
}
