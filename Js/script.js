let openAside = document.querySelector(".open-close .open");
let closeAside = document.querySelector(".open-close .close");
let asideLinks = document.querySelector(".aside-links");
let secondAside = document.querySelector(".second-aside");
let AllLinks = document.querySelectorAll(".aside-links nav a");
let moviesContent = document.querySelector("#moviesContent");
//open and close
openAside.addEventListener("click", function () {
  closeAside.classList.replace("d-none", "d-block");
  openAside.classList.replace("d-block", "d-none");
  asideLinks.style.left = 0;
  secondAside.style.left = "155px";
  AllLinks.forEach(link => link.style.padding = "12px 0px");
});
closeAside.addEventListener("click", function () {
  closeAside.classList.replace("d-block", "d-none");
  openAside.classList.replace("d-none", "d-block");
  asideLinks.style.left = "-155px";
  secondAside.style.left = 0;
  AllLinks.forEach(link => link.style.padding = "50px 0px");
});

let allItems = [];

AllLinks.forEach(links => {
  links.addEventListener("click", function(e){
    AllLinks.forEach(link => link.classList.remove("active"));
    e.target.classList.add("active");
    let categorys = e.target.getAttribute("category");
    if(categorys == null){
      return;
    }else if(categorys == "trending"){
      getTrendingMovies();
    }else{
      getMovies(categorys);
    }
  })
})

async function getMovies(category){
  let moviesResponse = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=c3d0703a9af4363eb77f3bff4df2732a`);
  let movies= await moviesResponse.json();
  allItems = movies.results;
  displayItems(allItems); 
}
async function getTrendingMovies(){
  let moviesTrendResponse = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=c3d0703a9af4363eb77f3bff4df2732a&language=en-US`);
  let moviesTrend= await moviesTrendResponse.json();
  allItems = moviesTrend.results;
  displayItems(allItems); 
}
function displayItems(arr){
    let movie = "";
    for(let i=0; i<arr.length; i++){
        movie +=`<div class="col-md-6 col-lg-4 my-3">
          <div class="movie-items position-relative rounded overflow-hidden" onclick="goToMovie(${arr[i].id})">
            <img class=" rounded w-100 img-add" src="https://image.tmdb.org/t/p/w500${arr[i].poster_path}" alt="${arr[i].title}">
            <p class="rate ">
            <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
            ${(arr[i].vote_average).toFixed(1)}
            </p>
            <div class="movie-info d-flex align-items-center">
              <div class="info">
                <h2>${arr[i].title}</h2>
                <p>${arr[i].overview.slice(0,130)}...</p>
                <p class="text">Data: ${arr[i].release_date}</p>
              </div>
            </div>
          </div>
        </div>
        `
    }
    moviesContent.innerHTML = movie;
}
getMovies("now_playing");

//search by word in api
let getMovieByWord = document.getElementById("getMovieWord");
async function searchMoviesByWord(search) {
  let MoviesSearchInApiResponse =await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&api_key=c3d0703a9af4363eb77f3bff4df2732a&language=en-US&include_adult=false`);
  let MoviesSearchInApiAll = await MoviesSearchInApiResponse.json();
  allItems = MoviesSearchInApiAll.results;
  displayItems(allItems)
}
getMovieByWord.addEventListener("input",function(){
  let inputValue = getMovieByWord.value;
  if(inputValue === ""){
    getMovies("now_playing");
  }else{
    searchMoviesByWord(getMovieByWord.value);
  }
})

//search movies in page
let searchMoviesInPage = document.getElementById("searchMovie");
function searchMoviesFromFoundInPage(term) {
  if (term === "") {
    displayItems(allItems);
  }else{
    let matchedProducts = [];
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].title.toLowerCase().includes(term.toLowerCase()) == true) {
        matchedProducts.push(allItems[i]);
        displayItems(matchedProducts);
      }
    }
  }
}
searchMoviesInPage.addEventListener("input",function(){
  searchMoviesFromFoundInPage(searchMoviesInPage.value);
})

//Validation
let nameInput = document.getElementById("nameInput");
let emailInput = document.getElementById("emailInput");
let messageInput = document.getElementById("messageInput");

const validateInput = (input, regex, errorElementId, message) => {
  const errorElement = document.getElementById(errorElementId);

  if (!regex.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorElement.innerHTML = `
      <div class="text-danger fs-6">
        <i class="fa-solid fa-circle-exclamation"></i>
        ${message}
      </div>
    `;
  } else {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    errorElement.innerHTML = "";
  }
};
nameInput.addEventListener("input",()=>
  validateInput(nameInput,/^[a-zA-Z ]{5,20}$/,"validationName","Name is not valid")
);
emailInput.addEventListener("input",()=>
  validateInput(emailInput,/^[^\s@]+@[^\s@]+\.[a-zA-Z]{3,6}$/,"validationEmail","Email is not valid")
);
messageInput.addEventListener("input", () =>
  validateInput(messageInput,/^.{20,200}$/,"validationMessage","Message must be between 20 and 200 characters"
  )
);

//log Out
if(sessionStorage.getItem("correctLogin") === "true"){
  document.querySelector(".login .login-signup").classList.add("d-none");
  document.querySelector(".login .log-out").classList.remove("d-none");
  document.querySelector(".login .Watchlist").classList.remove("d-none")
}else{
  document.querySelector(".login .login-signup").classList.remove("d-none");
  document.querySelector(".login .log-out").classList.add("d-none");
  document.querySelector(".login .Watchlist").classList.add("d-none")
}

document.querySelector(".login .log-out").addEventListener("click", function(e){
  e.preventDefault();
  sessionStorage.setItem("correctLogin","false"); 
  document.querySelector(".login .login-signup").classList.remove("d-none");
  document.querySelector(".login .log-out").classList.add("d-none");
  document.querySelector(".login .Watchlist").classList.add("d-none")
});