
const searchbtn = document.getElementById("searchbtn");
const watchbtn = document.getElementById("watchbtn");
const input = document.getElementById("input");
const movieresults = document.getElementById("movieresults");

input.addEventListener("input", function () {
  if (input.value.trim() === "") {
    movieresults.innerHTML = "";
  }
});


searchbtn.addEventListener("click", function () {
  movieresults.innerHTML = "";

  const value = input.value.trim();
  if (value === "") {
    alert("Please enter a movie name");
    return;
  }

  const API_KEY = "172c64de";
  const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${value}`;

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "False") {
        movieresults.innerHTML =
          `<p class="text-center text-light">No movie found</p>`;
        return;
      }

      data.Search.forEach(movie => {
        
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";

        
        const card = document.createElement("div");
        card.className = "card h-100";

        
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src =
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Image";
        img.alt = movie.Title;

        
        const body = document.createElement("div");
        body.className = "card-body text-center";

        const title = document.createElement("h5");
        title.className = "card-title text-light";
        title.textContent = movie.Title;

        const year = document.createElement("p");
        year.className = "card-text";
        year.textContent = movie.Year;

        const btn = document.createElement("button");
        btn.className = "btn btn-primary";
        btn.textContent = "Add to Watchlist";

        
        btn.addEventListener("click", function () {
          let watchlist =
            JSON.parse(localStorage.getItem("watchlist")) || [];

          const exists = watchlist.find(m => m.imdbID === movie.imdbID);
          if (exists) {
            alert(`${movie.Title} is already in your watchlist!`);
            return;
          }

          watchlist.push(movie);
          localStorage.setItem("watchlist", JSON.stringify(watchlist));
          alert(`${movie.Title} added to watchlist!`);
        });

      
        body.appendChild(title);
        body.appendChild(year);
        body.appendChild(btn);

        card.appendChild(img);
        card.appendChild(body);

        col.appendChild(card);
        movieresults.appendChild(col);
      });
    })
    .catch(error => {
      console.log("Error fetching data:", error);
    });
});


watchbtn.addEventListener("click", function () {
  movieresults.innerHTML = "";

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  if (watchlist.length === 0) {
    movieresults.innerHTML =
      `<p class="text-center text-light">Your watchlist is empty</p>`;
    return;
  }

  watchlist.forEach(movie => {
    movieresults.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450'}"
               class="card-img-top" alt="${movie.Title}">
          <div class="card-body text-center">
            <h5 class="card-title text-light">${movie.Title}</h5>
            <p class="card-text">${movie.Year}</p>
            <button class="btn btn-danger remove-watchlist-btn">Remove</button>
          </div>
        </div>
      </div>
    `;

  
    const removeBtn = movieresults.lastElementChild.querySelector(".remove-watchlist-btn");
    removeBtn.addEventListener("click", function () {
      
      watchlist = watchlist.filter(m => m.imdbID !== movie.imdbID);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      alert(`${movie.Title} removed from watchlist!`);

      
      watchbtn.click();
    });
  });
});

