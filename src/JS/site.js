GetMovies();

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
                "<img src=\"https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png\" style=\"width:100% \" >" +
                    "<div class=\"container\">" +
                        `<h4><b>${movie.name}</b></h4>` +
                        `<p>${movie.description}</p>` +
                        `<p>In stock: ${movie.stock}</p>` +
                    "</div>" +
            "</div>"

            movieDiv.insertAdjacentElement("beforeend", movieCard);
        });
    }
    catch (error) {
        console.log(error)
    }
}