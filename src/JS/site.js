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
                "<img src=\"https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png\" style=\"width:100%\" >" +
                    "<div class=\"container\">" +
                        `<h2><b>${movie.name}</b></h2>` +
                        `<p>${movie.description}</p>` +
                        `<p>In stock: ${movie.stock}</p>` +
                    "</div>" +

                    "<div class=\"card-footer\">"+
                    `<button onclick="ShowTrivia(${movie.id})">Trivia</button>` +
                        '<div id="modal-trivia" class="modal">' +
                        '<div class="modal-content">'+
                        '<div class="modal-header">'+
                          '<span class="close">&times;</span>'+
                          `<h2>Trivia for ${movie.name}</h2>`+
                        '</div>'+
                        '<div id="modal-body">'+
                        '</div>'+
                      '</div>'+
                        '</div>'+
                    "</div>"

            "</div>"+
            movieDiv.insertAdjacentElement("beforeend", movieCard);
        });
    } catch (error) {
        console.log(error);
    }
}
async function ShowTrivia(id) {
    const response = await fetch("https://localhost:5001/api/filmTrivia");
    const data = await response.json();
    var modal = document.getElementById("modal-trivia");
    var span = document.getElementsByClassName("close")[0];
    const triviaBody = document.getElementById("modal-body");

    data.forEach(trivia => {
        let triviaContent = document.createElement("div");
        triviaContent.innerHTML =
        `<p>${trivia.Trivia}</p>`

        triviaBody.insertAdjacentElement("beforeend", triviaContent);
        triviaBody.innerHTML = "Hejsan";
    });

    

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
async function GetTrivia(){
    
}
