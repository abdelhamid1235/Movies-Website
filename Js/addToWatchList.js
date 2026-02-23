document.querySelector(".to-back").addEventListener("click",function(){
    window.history.back();
})

let arrWatchList = JSON.parse(localStorage.getItem("WatchList")) || [];

if(arrWatchList.length === 0){
      document.querySelector("#watchlistContainer").innerHTML =`<p class="my-5 fs-1 text-warning text-center">No Movies Add to WatchList</p>`;
}
let movies = [];
arrWatchList.forEach(id => {
    getMovie(id);
});
async function getMovie(id){

    let response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=c3d0703a9af4363eb77f3bff4df2732a&language=en-US`
    );

    let data = await response.json();

    movies.push(data);

    displayItems(movies);
}
function displayItems(arr){

    let cartona = "";

    arr.forEach(movie => {

        cartona +=`<div class="col-md-6 col-lg-4 my-3">
          <div class="movie-items position-relative rounded overflow-hidden" onclick="goToMovie(${movie.id})">
            <img class=" rounded w-100 img-add" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p class="rate ">
            <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
            ${(movie.vote_average).toFixed(1)}
            </p>
            <div class="movie-info d-flex align-items-center">
              <div class="info">
                <h2>${movie.title}</h2>
                <p>${movie.overview.slice(0,130)}...</p>
                <p class="text">Data: ${movie.release_date}</p>
              </div>
            </div>
          </div>
        </div>
        `;
    });

    document.querySelector("#watchlistContainer").innerHTML = cartona;
}