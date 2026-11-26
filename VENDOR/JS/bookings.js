// BOOKING MANAGEMENT
let bookings = JSON.parse(localStorage.getItem("cinebookBookings")) || [
    {
        id: "CB101",
        customer: "Rahul Sharma",
        movie: "Pushpa 2",
        date: "2026-11-25",
        seats: "A1, A2",
        amount: 500,
        status: "Confirmed"
    },
    {
        id: "CB102",
        customer: "Aman Verma",
        movie: "Stree 2",
        date: "2026-11-25",
        seats: "B3",
        amount: 200,
        status: "Confirmed"
    },
    {
        id: "CB103",
        customer: "Priya Singh",
        movie: "Pushpa 2",
        date: "2026-11-26",
        seats: "C1, C2",
        amount: 500,
        status: "Cancelled"
    }
];

const bookingTable = document.getElementById("bookingTable");

function saveBookings() {
    localStorage.setItem("cinebookBookings", JSON.stringify(bookings));
}

function renderBookings() {
    bookingTable.innerHTML = "";

    const search = document.getElementById("searchBooking").value.toLowerCase();
    const filter = document.getElementById("bookingFilter").value;

    const filteredBookings = bookings.filter(booking =>
        (booking.customer.toLowerCase().includes(search) ||
         booking.movie.toLowerCase().includes(search) ||
         booking.id.toLowerCase().includes(search)) &&
        (filter === "all" || booking.status === filter)
    );

    filteredBookings.forEach(booking => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.movie}</td>
            <td>${booking.date}</td>
            <td>${booking.seats}</td>
            <td>₹${booking.amount}</td>
            <td>
                <span class="status ${booking.status === "Cancelled" ? "cancelled" : ""}">
                    ${booking.status}
                </span>
            </td>
            <td>
                ${booking.status === "Confirmed"
                    ? `<button class="action-btn" onclick="cancelBooking('${booking.id}')">Cancel</button>`
                    : "—"}
            </td>
        `;

        bookingTable.appendChild(row);
    });

    document.getElementById("totalBookings").textContent = bookings.length;

    document.getElementById("confirmedBookings").textContent =
        bookings.filter(b => b.status === "Confirmed").length;

    document.getElementById("cancelledBookings").textContent =
        bookings.filter(b => b.status === "Cancelled").length;
}

// CANCEL BOOKING
function cancelBooking(id) {
    if (confirm("Are you sure you want to cancel this booking?")) {
        const booking = bookings.find(b => b.id === id);

        if (booking) {
            booking.status = "Cancelled";
            saveBookings();
            renderBookings();
        }
    }
}

// SEARCH AND FILTER
document.getElementById("searchBooking").addEventListener("input", renderBookings);
document.getElementById("bookingFilter").addEventListener("change", renderBookings);

// INITIAL DISPLAY
renderBookings();
