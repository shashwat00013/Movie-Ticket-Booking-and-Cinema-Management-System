
// MOVIE MANAGEMENT

let movies = JSON.parse(localStorage.getItem("cinebookMovies")) || [
    {
        id: 1,
        name: "Pushpa 2",
        genre: "Action",
        language: "Hindi",
        duration: "3h 20m",
        status: "Now Showing"
    },
    {
        id: 2,
        name: "Avengers",
        genre: "Action / Sci-Fi",
        language: "English",
        duration: "2h 30m",
        status: "Coming Soon"
    },
    {
        id: 3,
        name: "Stree 2",
        genre: "Horror / Comedy",
        language: "Hindi",
        duration: "2h 25m",
        status: "Now Showing"
    }
];

const movieGrid = document.getElementById("movieGrid");

function saveMovies() {
    localStorage.setItem("cinebookMovies", JSON.stringify(movies));
}

function renderMovies() {
    movieGrid.innerHTML = "";

    const search = document.getElementById("searchMovie").value.toLowerCase();
    const filter = document.getElementById("statusFilter").value;

    const filteredMovies = movies.filter(movie =>
        movie.name.toLowerCase().includes(search) &&
        (filter === "all" || movie.status === filter)
    );

    filteredMovies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <div class="movie-icon">🎬</div>
            <h3>${movie.name}</h3>
            <p>Genre: ${movie.genre}</p>
            <p>Language: ${movie.language}</p>
            <p>Duration: ${movie.duration}</p>

            <span class="movie-status ${movie.status === "Coming Soon" ? "coming" : ""}">
                ${movie.status}
            </span>

            <div class="movie-actions">
                <button class="edit-btn" onclick="editMovie(${movie.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
            </div>
        `;

        movieGrid.appendChild(card);
    });

    document.getElementById("totalMovies").textContent = movies.length;

    document.getElementById("nowShowing").textContent =
        movies.filter(movie => movie.status === "Now Showing").length;

    document.getElementById("comingSoon").textContent =
        movies.filter(movie => movie.status === "Coming Soon").length;
}

// ADD MOVIE
document.getElementById("addMovieBtn").addEventListener("click", function() {
    const name = prompt("Enter Movie Name:");
    if (!name) return;

    const genre = prompt("Enter Movie Genre:");
    if (!genre) return;

    const language = prompt("Enter Language:");
    if (!language) return;

    const duration = prompt("Enter Duration (e.g. 2h 30m):");
    if (!duration) return;

    const status = prompt("Enter Status: Now Showing or Coming Soon");

    if (!["Now Showing", "Coming Soon"].includes(status)) {
        alert("Please enter a valid status.");
        return;
    }

    movies.push({
        id: Date.now(),
        name,
        genre,
        language,
        duration,
        status
    });

    saveMovies();
    renderMovies();
});

// EDIT MOVIE
function editMovie(id) {
    const movie = movies.find(item => item.id === id);

    const name = prompt("Movie Name:", movie.name);
    if (!name) return;

    const genre = prompt("Genre:", movie.genre);
    if (!genre) return;

    const language = prompt("Language:", movie.language);
    if (!language) return;

    const duration = prompt("Duration:", movie.duration);
    if (!duration) return;

    const status = prompt("Status: Now Showing or Coming Soon", movie.status);

    if (!["Now Showing", "Coming Soon"].includes(status)) {
        alert("Invalid status.");
        return;
    }

    Object.assign(movie, { name, genre, language, duration, status });

    saveMovies();
    renderMovies();
}

// DELETE MOVIE
function deleteMovie(id) {
    if (confirm("Are you sure you want to delete this movie?")) {
        movies = movies.filter(movie => movie.id !== id);
        saveMovies();
        renderMovies();
    }
}

// SEARCH AND FILTER
document.getElementById("searchMovie").addEventListener("input", renderMovies);
document.getElementById("statusFilter").addEventListener("change", renderMovies);

// INITIAL DISPLAY
renderMovies();
