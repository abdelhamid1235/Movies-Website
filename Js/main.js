// to top
let topButton = document.querySelector(".top");
window.addEventListener("scroll", function() {
  if (window.scrollY > 300) {
    topButton.style.display = "flex";
  } else {
    topButton.style.display = "none";
  }
});
topButton.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// light and dark mode
let modeButton = document.querySelector(".mode");
modeButton.addEventListener("click", function() {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    document.documentElement.style.setProperty('--black-color-dark', "#fff");
    document.documentElement.style.setProperty('--white-color-dark', "#000");
  } else {
    document.documentElement.style.setProperty('--black-color-dark', "#000");
    document.documentElement.style.setProperty('--white-color-dark', "#fff");
  }
  modeButton.querySelectorAll("i").forEach(icon => icon.classList.toggle("d-none"));
});

// move to new movie
function goToMovie(id) {
  let correctLogin = sessionStorage.getItem("correctLogin") === "true";
  if (correctLogin) {
    window.location.href = `movies.html?id=${id}`;
  } else {
    window.location.href = `login.html`;
  }
}