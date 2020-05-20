
export async function GetMovies() {
    const response = await fetch("https://localhost:5001/api/film");
    return await response.json();
}
export async function AddTrivia(id) {
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
export async function GetRentals() {
    const response = await fetch("https://localhost:5001/api/RentedFilm");
    return await response.json();
}
export async function ReturnRental(filmid) {
    var rentedData = await GetRentals();
    rental = rentedData.find(x => x.filmId == filmid && x.studioId == localStorage.UserId && x.returned == false);
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
export async function Rent(filmid) {
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