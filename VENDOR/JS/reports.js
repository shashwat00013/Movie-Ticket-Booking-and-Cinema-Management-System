
// REPORTS & ANALYTICS

const bookings = JSON.parse(localStorage.getItem("cinebookBookings")) || [];
const movies = JSON.parse(localStorage.getItem("cinebookMovies")) || [];
const shows = JSON.parse(localStorage.getItem("cinebookShows")) || [];

const confirmedBookings = bookings.filter(
    booking => booking.status?.toLowerCase() === "confirmed"
);

// TOTAL BOOKINGS
document.getElementById("reportBookings").textContent =
    bookings.length;

// TOTAL REVENUE
const totalRevenue = confirmedBookings.reduce(
    (total, booking) => total + Number(booking.amount || 0), 0
);

document.getElementById("reportRevenue").textContent =
    "₹" + totalRevenue.toLocaleString("en-IN");

// TOTAL SHOWS
document.getElementById("reportShows").textContent =
    shows.length;

// TOTAL MOVIES
document.getElementById("reportMovies").textContent =
    movies.length;

// BOOKING TABLE
const reportTable = document.getElementById("reportTable");

if (bookings.length === 0) {
    reportTable.innerHTML = `
        <tr>
            <td colspan="5">No bookings available.</td>
        </tr>
    `;
} else {
    bookings.forEach(booking => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id || "N/A"}</td>
            <td>${booking.movie || "N/A"}</td>
            <td>${booking.seats || "N/A"}</td>
            <td>₹${Number(booking.amount || 0).toLocaleString("en-IN")}</td>
            <td>${booking.status || "Pending"}</td>
        `;

        reportTable.appendChild(row);
    });
}
