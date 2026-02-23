let arrWatchList = JSON.parse(localStorage.getItem("WatchList")) || [];

let params = new URLSearchParams(window.location.search);
let movieId = params.get("id");
let movieVideos = [];

async function getMovieDetails() {
  let response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=c3d0703a9af4363eb77f3bff4df2732a&language=en-US&append_to_response=credits,recommendations,videos,release_dates`
  );

  let data = await response.json();

  movieVideos = data.videos?.results || [];

  displayMovieDetails(data);
  displayCast(data.credits.cast);

  if (data.recommendations && data.recommendations.results) {
    displayRecommendations(data.recommendations.results);
  }
}
function displayMovieDetails(movie) {
  let year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  let runtime = movie.runtime || 0;
  let hours = Math.floor(runtime / 60);
  let minutes = runtime % 60;
  let duration = runtime ? `${hours}h ${minutes}m` : "N/A";

  // Genres
  let genres = movie.genres.length > 0
    ? movie.genres.map(g => g.name).join(", ")
    : "N/A";

  // Director
  let directors = movie.credits.crew
    .filter(person => person.job === "Director")
    .map(person => person.name)
    .join(", ");
  if (directors === "") directors = "N/A";

  let html = `
    <div class="row  g-4">
      <div class="col-md-4">
        <img class="w-100"
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          alt="${movie.title}">
      </div>

      <div class="col-md-8 text-white">
        <h1 class="mb-1">${movie.title}</h1>

        <p class="mb-4">Directed by: ${directors}</p>

        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge bg-dark fs-6"><i class="fa-solid fa-calendar-days"style="margin-right:5px;"></i>${year}</span>
          <span class="badge bg-dark fs-6"><i class="fa-regular fa-clock"style="margin-right:5px;"></i>${duration}</span>
          <span class="badge bg-dark fs-6">${genres}</span>
        </div>
        <div class="watch-list my-4 d-flex align-items-center ">
          <button class="btn btn-warning rounded-5 add-to-watchlist"title="Add to Watchlist"><i class="fa-regular fa-bookmark"></i> Add to Watchlist</button>
          <div>
            <span class="watch-trailer" title="Watch Trailer"><i class="fa-regular fa-circle-play" onclick="displayTrailer(movieVideos)"></i></span>
            <span class="watch-trailer" title="Mark as Watched"><i class="fa-regular fa-circle-check"></i></span>
            <span class="watch-trailer" title="Share Movie"><i class="fa-solid fa-share"></i></span>
          </div>
        </div>
        <p class=" mt-5 overview">${movie.overview}</p>
      </div>
    </div>
  `;

  document.getElementById("movieDetails").innerHTML = html;
  let button = document.querySelector(".add-to-watchlist");
  if(arrWatchList.includes(movieId)){
      button.classList.add("add-or-remove");
      button.innerHTML = `<i class="fa-solid fa-bookmark"></i> Remove from Watchlist`;
  }
  
  document.querySelector(".cast-moive").innerHTML = `Cast of ${movie.title}`;
  document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  window.document.title = `${movie.title} Movie`; 
}

// cast
let allCast = [];
let isExpanded = false;

function displayCast(cast) {
  allCast = cast;
  renderCast();
}
function renderCast() {
  let cartona = "";
  let castToShow = isExpanded ? allCast : allCast.slice(0, 5);

  for (let i = 0; i < castToShow.length; i++) {
    let actorImg = castToShow[i].profile_path
      ? `https://image.tmdb.org/t/p/w500${castToShow[i].profile_path}`
      : `https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fluma.plex.tv%2Fimages%2Fdefault-avatar.png`;

    cartona += `
        <div class="p-2">
          <img src="${actorImg}" style="width:150px;height:150px;border-radius:50%;object-fit:cover;cursor:pointer;" alt="${castToShow[i].name}">
          <div class="text-center mt-2">
            <h6 style="color:var(--white-color);">${castToShow[i].name}</h6>
          </div>
        </div>
    `;
  }

  document.querySelector("#castContainer .cast-moive-info").innerHTML = cartona;

  document.getElementById("showMoreCast").textContent =
    isExpanded ? "Show Less" : "Show More";
}
document.getElementById("showMoreCast").addEventListener("click", function () {
  isExpanded = !isExpanded;
  renderCast();
});

//trailer
function displayTrailer(videos) {
  document.querySelector("#trailerContainer").classList.replace("d-none", "d-flex");

  let trailer = videos.find(
    video => video.type === "Trailer" && video.site === "YouTube"
  );

  if (!trailer) {
    document.querySelector(".trailer-overlay").innerHTML =
      `<i class="fa-regular fa-circle-xmark close" onclick="closeTrailer()"></i>
      <div class="vh-100 d-flex justify-content-center align-items-center">
          <p class="text-white fs-3">No Trailer Available</p>
      </div>`;
    return;
  }

  let html = `
    <i class="fa-regular fa-circle-xmark close" onclick="closeTrailer()"></i>
    <div class="ratio ratio-16x9">
      <iframe 
        src="https://www.youtube.com/embed/${trailer.key}" 
        title="Trailer"
        allowfullscreen>
      </iframe>
    </div>
  `;

  document.querySelector(".trailer-overlay").innerHTML = html;
}
function closeTrailer() {
  document.querySelector("#trailerContainer").classList.replace("d-flex","d-none");
  document.querySelector(".trailer-overlay").innerHTML = "";
}

// Recommendations
function displayRecommendations(recommendations) {

  if (recommendations.length === 0) {
    document.getElementById("recommendationsContainer").innerHTML =
      `<p class="no-recommendations">No Recommendations Available</p>`;
    return;
  }

  let cartona = "";

  for (let i = 0; i < recommendations.slice(0, 12).length; i++) {

    let img = recommendations[i].poster_path
      ? `https://image.tmdb.org/t/p/w500${recommendations[i].poster_path}`
      : `../images/no-image.png`;

    cartona +=`<div class="col-md-6 col-lg-4 my-3">
          <div class="movie-items position-relative rounded overflow-hidden border-2" onclick="goToMovie(${recommendations[i].id})">
            <img class=" rounded w-100 img-add" src="${img}" alt="${recommendations[i].title}">
            <p class="rate ">
            <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
            ${(recommendations[i].vote_average).toFixed(1)}
            </p>
            <div class="movie-info d-flex align-items-center">
              <div class="info">
                <h2>${recommendations[i].title}</h2>
                <p>${recommendations[i].overview.slice(0,130)}...</p>
                <p class="text">Data: ${recommendations[i].release_date}</p>
              </div>
            </div>
          </div>
        </div>
        `
  }

  document.getElementById("recommendationsContainer").innerHTML = cartona;
}

getMovieDetails();

// Add to Watchlist
document.body.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-to-watchlist")) {
    e.target.classList.toggle("add-or-remove");
    if(e.target.classList.contains("add-or-remove")){
      e.target.innerHTML = `<i class="fa-solid fa-bookmark"></i> Remove from Watchlist`;
      alert("Movie added to Watchlist!");
      if(!arrWatchList.includes(movieId)){
        arrWatchList.push(movieId);
      }
    }else{
      e.target.innerHTML = `<i class="fa-regular fa-bookmark"></i> Add to Watchlist`;
      alert("Movie Removed From WatchList");
      arrWatchList = arrWatchList.filter(id => id !== movieId);
    }
    localStorage.setItem("WatchList", JSON.stringify(arrWatchList));
  }
});


// function displayItems(arr){
//     let movie = "";
//     for(let i=0; i<arr.length; i++){
//         movie +=`<div class="col-md-6 col-lg-4 my-3">
//           <div class="movie-items position-relative rounded overflow-hidden" onclick="goToMovie(${arr[i].id})">
//             <img class=" rounded w-100 img-add" src="https://image.tmdb.org/t/p/w500${arr[i].poster_path}" alt="${arr[i].title}">
//             <p class="rate ">
//             <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
//             ${(arr[i].vote_average).toFixed(1)}
//             </p>
//             <div class="movie-info d-flex align-items-center">
//               <div class="info">
//                 <h2>${arr[i].title}</h2>
//                 <p>${arr[i].overview.slice(0,130)}...</p>
//                 <p class="text">Data: ${arr[i].release_date}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         `
//     }
//     moviesContent.innerHTML = movie;
// }