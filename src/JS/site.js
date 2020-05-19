GetMovieCards();
async function GetMovies() {
    const response = await fetch("https://localhost:5001/api/film");
    return await response.json();
}
async function GetRentals() {
    const response = await fetch("https://localhost:5001/api/RentedFilm");
    return await response.json();
}

async function GetMovieCards() {
    rentedData = await GetRentals();
    data = await GetMovies();
    const mainDiv = document.getElementById("main");
    mainDiv.innerHTML = "";

    data.forEach(movie => {
        //Backend should add a movie.description property, temporary solution in the meantime
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
            `<div id="card-footer-${movie.id}"class="card-footer">` +
            `<button class="card-button" onclick="ShowModal('${movie.name}');ShowTrivia(${movie.id});">Trivia</button>` +
            "</div>" +
            '<div id="modal-trivia" class="modal">' +
            '</div>' +
            "</div>";

            mainDiv.insertAdjacentElement("beforeend", movieCard);

        if (localStorage.UserName != null) {
            rentedDataFiltered = rentedData.filter(x => x.filmId == movie.id && x.studioId == localStorage.UserId && x.returned == false);
            document.getElementById(`card-footer-${movie.id}`).insertAdjacentHTML("beforeend",
                `<button class="card-button" onclick="ShowModal('${movie.name}');ShowAddTrivia(${movie.id});">Add Trivia</button>`);

            if (rentedDataFiltered.length == 0) {
                document.getElementById(`card-footer-${movie.id}`).insertAdjacentHTML("beforeend",
                `<button class="card-button" onclick="Rent(${movie.id});">Rent</button>`);
            }
            else {
                document.getElementById(`card-footer-${movie.id}`).insertAdjacentHTML("beforeend",
                `<button class="card-button" onclick="ReturnRental(${movie.id});">Return Rental</button>`);
            }
        }
    });
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
    var movies = await GetMovies();
    movies = movies.filter(x => x.id == filmid && x.stock > 0);

    if (movies.length > 0) {
        try {
            await fetch('https://localhost:5001/api/RentedFilm', {
                method: 'POST',
                body: JSON.stringify({
                    filmId: Number(filmid),
                    studioId: Number(localStorage.UserId)
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            await fetch(`https://localhost:5001/api/film/${filmid}`, {
                ///TODO Change Stock
                method: 'PUT',
                body: JSON.stringify({
                    id: Number(filmid),
                    name: movies[0].name,
                    stock: Number(movies[0].stock - 1)
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            alert("Movie has been successfully rented");
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        alert("Movie is not in stock");
    }
    location.reload();
}
async function ReturnRental(filmid) {
    var rentedData = await GetRentals();
    rentedDataFiltered = rentedData.filter(x => x.filmId == filmid && x.studioId == localStorage.UserId && x.returned == false);
    rental = rentedDataFiltered[0];
    rental.returned = true;
    var movies = await GetMovies();
    movies = movies.filter(x => x.id == filmid);

    try {
        await fetch(`https://localhost:5001/api/RentedFilm/${rental.id}`, {
            method: 'PUT',
            body: JSON.stringify(rental),
            headers: { 'Content-Type': 'application/json' }
        });
        await fetch(`https://localhost:5001/api/film/${filmid}`, {
            ///TODO Change Stock
            method: 'PUT',
            body: JSON.stringify({
                id: Number(filmid),
                name: movies[0].name,
                stock: Number(movies[0].stock + 1)
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        alert("Movie has been successfully been returned");
    } catch (error) {
        console.log(error);
    }
    location.reload();
}
