// SCREEN MANAGEMENT
let screens = JSON.parse(localStorage.getItem("cinebookScreens")) || [
    {
        id: 1,
        name: "Screen 1",
        theatre: "PVR Cinemas",
        seats: 200,
        category: "Gold / Silver",
        status: "Active"
    },
    {
        id: 2,
        name: "Screen 2",
        theatre: "PVR Cinemas",
        seats: 150,
        category: "Silver",
        status: "Active"
    },
    {
        id: 3,
        name: "Screen 1",
        theatre: "INOX Cinemas",
        seats: 140,
        category: "Gold",
        status: "Active"
    }
];
const screenGrid = document.getElementById("screenGrid");
function saveScreens() {
    localStorage.setItem("cinebookScreens", JSON.stringify(screens));
}
function renderScreens() {
    screenGrid.innerHTML = "";
    const search = document.getElementById("searchScreen").value.toLowerCase();
    const filter = document.getElementById("theatreFilter").value;
    const filteredScreens = screens.filter(screen =>
        (screen.name.toLowerCase().includes(search) ||
         screen.theatre.toLowerCase().includes(search)) &&
        (filter === "all" || screen.theatre === filter)
    );

    filteredScreens.forEach(screen => {
        const card = document.createElement("div");
        card.className = "screen-card";

        card.innerHTML = `
            <div class="screen-top">
                <div class="screen-icon">🎬</div>
                <span class="status">${screen.status}</span>
            </div>

            <h3>${screen.name}</h3>
            <p>${screen.theatre}</p>

            <div class="screen-details">
                <span>${screen.seats} Seats</span>
                <span>${screen.category}</span>
            </div>

            <div class="screen-actions">
                <button class="edit-btn" onclick="editScreen(${screen.id})">Edit</button>
                <button class="delete-btn" onclick="deleteScreen(${screen.id})">Delete</button>
            </div>
        `;

        screenGrid.appendChild(card);
    });

    document.getElementById("totalScreens").textContent = screens.length;

    document.getElementById("totalSeats").textContent =
        screens.reduce((total, screen) => total + screen.seats, 0);

    document.getElementById("activeScreens").textContent =
        screens.filter(screen => screen.status === "Active").length;
}

// ADD SCREEN
document.getElementById("addScreenBtn").addEventListener("click", function() {
    const theatre = prompt("Enter Theatre Name (PVR Cinemas / INOX Cinemas):");
    if (!theatre) return;

    const name = prompt("Enter Screen Name:");
    if (!name) return;

    const seats = Number(prompt("Enter Total Seats:"));
    if (!Number.isInteger(seats) || seats <= 0) {
        alert("Please enter a valid seat number.");
        return;
    }

    const category = prompt("Enter Category (Gold / Silver):");
    if (!category) return;

    screens.push({
        id: Date.now(),
        name: name,
        theatre: theatre,
        seats: seats,
        category: category,
        status: "Active"
    });

    saveScreens();
    renderScreens();
});

// EDIT SCREEN
function editScreen(id) {
    const screen = screens.find(item => item.id === id);

    const name = prompt("Enter new Screen Name:", screen.name);
    if (!name) return;

    const seats = Number(prompt("Enter new Seat Count:", screen.seats));

    if (!Number.isInteger(seats) || seats <= 0) {
        alert("Invalid seat count.");
        return;
    }

    screen.name = name;
    screen.seats = seats;

    saveScreens();
    renderScreens();
}

// DELETE SCREEN
function deleteScreen(id) {
    if (confirm("Are you sure you want to delete this screen?")) {
        screens = screens.filter(screen => screen.id !== id);
        saveScreens();
        renderScreens();
    }
}

// SEARCH
document.getElementById("searchScreen").addEventListener("input", renderScreens);

// THEATRE FILTER
document.getElementById("theatreFilter").addEventListener("change", renderScreens);

// INITIAL DISPLAY
renderScreens();
