
// REVENUE MANAGEMENT

const bookings = JSON.parse(
    localStorage.getItem("cinebookBookings")
) || [];

const revenueTable = document.getElementById("revenueTable");

function renderRevenue() {
    revenueTable.innerHTML = "";

    const today = new Date().toLocaleDateString("en-CA");

    const confirmedBookings = bookings.filter(
        booking => booking.status === "Confirmed"
    );

    const totalRevenue = confirmedBookings.reduce(
        (total, booking) => total + Number(booking.amount), 0
    );

    const todayBookings = confirmedBookings.filter(
        booking => booking.date === today
    );

    const todayRevenue = todayBookings.reduce(
        (total, booking) => total + Number(booking.amount), 0
    );

    document.getElementById("totalRevenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");

    document.getElementById("todayRevenue").textContent =
        "₹" + todayRevenue.toLocaleString("en-IN");

    document.getElementById("totalTransactions").textContent =
        confirmedBookings.length;

    const search = document.getElementById("searchRevenue").value.toLowerCase();
    const filter = document.getElementById("revenueFilter").value;

    const filteredBookings = confirmedBookings.filter(booking =>
        (booking.id.toLowerCase().includes(search) ||
         booking.movie.toLowerCase().includes(search)) &&
        (filter === "all" || booking.date === today)
    );

    filteredBookings.forEach(booking => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.movie}</td>
            <td>${booking.date}</td>
            <td>${booking.seats}</td>
            <td>₹${Number(booking.amount).toLocaleString("en-IN")}</td>
            <td><span class="status">Confirmed</span></td>
        `;

        revenueTable.appendChild(row);
    });
}

document.getElementById("searchRevenue")
    .addEventListener("input", renderRevenue);

document.getElementById("revenueFilter")
    .addEventListener("change", renderRevenue);

renderRevenue();
