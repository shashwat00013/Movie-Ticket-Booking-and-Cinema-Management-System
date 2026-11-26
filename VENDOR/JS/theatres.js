
const theatreGrid = document.getElementById("theatreGrid");
const addTheatreBtn = document.getElementById("addTheatreBtn");

let theatres = [
    {
        name: "PVR Cinemas",
        location: "Mathura, Uttar Pradesh",
        screens: 4,
        seats: 320
    },
    {
        name: "INOX Cinemas",
        location: "Agra, Uttar Pradesh",
        screens: 4,
        seats: 280
    }
];

// Load saved data
const savedTheatres = localStorage.getItem("cinebookTheatres");

if (savedTheatres) {
    theatres = JSON.parse(savedTheatres);
}

// Save data
function saveTheatres() {
    localStorage.setItem(
        "cinebookTheatres",
        JSON.stringify(theatres)
    );
}

// Display theatres
function displayTheatres() {

    theatreGrid.innerHTML = "";

    theatres.forEach((theatre, index) => {

        theatreGrid.innerHTML += `
            <div class="theatre-card">

                <div class="theatre-icon">🎬</div>

                <span class="status">Active</span>

                <h3>${theatre.name}</h3>

                <p>${theatre.location}</p>

                <div class="theatre-info">
                    <span>${theatre.screens} Screens</span>
                    <span>${theatre.seats} Seats</span>
                </div>

                <div class="card-actions">
                    <button class="edit-btn"
                        onclick="editTheatre(${index})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteTheatre(${index})">
                        Delete
                    </button>
                </div>

            </div>
        `;
    });

    document.getElementById("totalTheatres").textContent =
        theatres.length;

    document.getElementById("activeTheatres").textContent =
        theatres.length;
}

// Add Theatre
addTheatreBtn.addEventListener("click", function() {

    const name = prompt("Enter Theatre Name:");

    if (!name || !name.trim()) return;

    const location = prompt("Enter Theatre Location:");

    if (!location || !location.trim()) return;

    const screens = Number(prompt("Enter Total Screens:"));

    if (!Number.isInteger(screens) || screens <= 0) {
        alert("Please enter a valid screen count.");
        return;
    }

    const seats = Number(prompt("Enter Total Seats:"));

    if (!Number.isInteger(seats) || seats <= 0) {
        alert("Please enter a valid seat count.");
        return;
    }

    theatres.push({
        name: name.trim(),
        location: location.trim(),
        screens,
        seats
    });

    saveTheatres();
    displayTheatres();

});

// Edit Theatre
function editTheatre(index) {

    const theatre = theatres[index];

    const name = prompt("Update Theatre Name:", theatre.name);

    if (!name || !name.trim()) return;

    const location = prompt("Update Location:", theatre.location);

    if (!location || !location.trim()) return;

    const screens = Number(
        prompt("Update Screens:", theatre.screens)
    );

    if (!Number.isInteger(screens) || screens <= 0) {
        alert("Invalid screen count.");
        return;
    }

    const seats = Number(
        prompt("Update Seats:", theatre.seats)
    );

    if (!Number.isInteger(seats) || seats <= 0) {
        alert("Invalid seat count.");
        return;
    }

    theatres[index] = {
        name: name.trim(),
        location: location.trim(),
        screens,
        seats
    };

    saveTheatres();
    displayTheatres();
}

// Delete Theatre
function deleteTheatre(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this theatre?"
    );

    if (!confirmDelete) return;

    theatres.splice(index, 1);

    saveTheatres();
    displayTheatres();

}

// Initial Display
displayTheatres();
