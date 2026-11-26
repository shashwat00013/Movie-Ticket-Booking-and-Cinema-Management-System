
// SHOW MANAGEMENT

const showGrid = document.getElementById("showGrid");
const addShowBtn = document.getElementById("addShowBtn");
const searchShow = document.getElementById("searchShow");
const screenFilter = document.getElementById("screenFilter");

let shows = JSON.parse(localStorage.getItem("cinebookShows")) || [];

const movies = JSON.parse(localStorage.getItem("cinebookMovies")) || [];
const screens = JSON.parse(localStorage.getItem("cinebookScreens")) || [];

function saveShows() {
    localStorage.setItem("cinebookShows", JSON.stringify(shows));
}

function getMovieName(movie) {
    return movie.name || movie.title || movie.movieName || "";
}

function getScreenName(screen) {
    return screen.name || screen.screenName || "";
}

// SCREEN FILTER
function loadScreenFilter() {
    screenFilter.innerHTML = '<option value="all">All Screens</option>';

    screens.forEach(screen => {
        const name = getScreenName(screen);
        if (!name) return;

        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        screenFilter.appendChild(option);
    });
}

// RENDER SHOWS
function renderShows() {
    showGrid.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    const search = searchShow.value.toLowerCase();
    const filter = screenFilter.value;

    const filteredShows = shows.filter(show =>
        (show.movie || "").toLowerCase().includes(search) ||
        (show.screen || "").toLowerCase().includes(search)
    ).filter(show =>
        filter === "all" || show.screen === filter
    );

    document.getElementById("totalShows").textContent = shows.length;

    document.getElementById("todayShows").textContent =
        shows.filter(show => show.date === today).length;

    document.getElementById("upcomingShows").textContent =
        shows.filter(show => show.date > today).length;

    if (filteredShows.length === 0) {
        showGrid.innerHTML = "<p>No shows found.</p>";
        return;
    }

    filteredShows.forEach(show => {
        const card = document.createElement("div");
        card.className = "show-card";

        card.innerHTML = `
            <div class="show-icon">🎬</div>
            <h3>${show.movie}</h3>
            <p>Screen: ${show.screen}</p>
            <p>Date: ${show.date}</p>
            <p>Time: ${show.time}</p>
            <p>Ticket Price: ₹${show.price}</p>
            <span class="status">Scheduled</span>

            <div class="show-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        card.querySelector(".edit-btn").addEventListener("click", () => {
            editShow(show.id);
        });

        card.querySelector(".delete-btn").addEventListener("click", () => {
            deleteShow(show.id);
        });

        showGrid.appendChild(card);
    });
}

// ADD SHOW
addShowBtn.addEventListener("click", function() {
    if (movies.length === 0) {
        alert("Please add a movie first.");
        return;
    }

    if (screens.length === 0) {
        alert("Please add a screen first.");
        return;
    }

    const movieNames = movies.map(getMovieName).filter(Boolean);
    const screenNames = screens.map(getScreenName).filter(Boolean);

    const movie = prompt(
        "Enter Movie Name:\n" + movieNames.join(", ")
    );

    if (!movie) return;

    if (!movieNames.some(name => name.toLowerCase() === movie.trim().toLowerCase())) {
        alert("Please enter a movie from your movie list.");
        return;
    }

    const screen = prompt(
        "Enter Screen Name:\n" + screenNames.join(", ")
    );

    if (!screen) return;

    if (!screenNames.some(name => name.toLowerCase() === screen.trim().toLowerCase())) {
        alert("Please enter a screen from your screen list.");
        return;
    }

    const date = prompt("Enter show date (YYYY-MM-DD):");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        alert("Please enter date in YYYY-MM-DD format.");
        return;
    }

    const time = prompt("Enter show time (e.g. 10:00 AM):");
    if (!time) return;

    const price = Number(prompt("Enter ticket price:"));

    if (!Number.isFinite(price) || price <= 0) {
        alert("Please enter a valid ticket price.");
        return;
    }

    shows.push({
        id: Date.now(),
        movie: movie.trim(),
        screen: screen.trim(),
        date,
        time,
        price,
        status: "Scheduled"
    });

    saveShows();
    renderShows();
});

// EDIT SHOW
function editShow(id) {
    const show = shows.find(item => item.id === id);
    if (!show) return;

    const date = prompt("Enter new date (YYYY-MM-DD):", show.date);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;

    const time = prompt("Enter new show time:", show.time);
    if (!time) return;

    const price = Number(prompt("Enter new ticket price:", show.price));

    if (!Number.isFinite(price) || price <= 0) {
        alert("Enter a valid ticket price.");
        return;
    }

    show.date = date;
    show.time = time;
    show.price = price;

    saveShows();
    renderShows();
}

// DELETE SHOW
function deleteShow(id) {
    if (!confirm("Are you sure you want to delete this show?")) return;

    shows = shows.filter(show => show.id !== id);

    saveShows();
    renderShows();
}

// SEARCH AND FILTER
searchShow.addEventListener("input", renderShows);
screenFilter.addEventListener("change", renderShows);

loadScreenFilter();
renderShows();
