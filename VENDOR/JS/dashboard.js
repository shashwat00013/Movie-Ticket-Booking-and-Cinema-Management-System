// ===================================
// CINEBOOK VENDOR DASHBOARD JS
// ===================================
// 1. SIDEBAR NAVIGATION
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach(function(item) {
    item.addEventListener("click", function(event) {
        const link = item.getAttribute("href");
        // Prevent navigation only for unfinished links
        if (!link || link === "#") {
            event.preventDefault();
        }
        menuItems.forEach(function(menu) {
            menu.classList.remove("active");
        });
        item.classList.add("active");
    });
});
// 2. NOTIFICATION BUTTON
const notificationBtn = document.querySelector(".notification-btn");
if (notificationBtn) {
    notificationBtn.addEventListener("click", function() {
        alert("You are all caught up! No new notifications.");
    });
}
// 3. DATE BUTTON
const dateBtn = document.querySelector(".date-btn");
if (dateBtn) {
    dateBtn.addEventListener("click", function() {
        alert("Showing today's dashboard overview.");
    });
}
// 4. REVENUE FILTER
const revenueFilter = document.querySelector(".panel-header select");
if (revenueFilter) {
    revenueFilter.addEventListener("change", function() {
        alert("Selected filter: " + revenueFilter.value);
    });
}
// 5. VIEW ALL BOOKINGS
const viewAllBtn = document.querySelector(".bookings-panel .panel-header a");
if (viewAllBtn) {
    viewAllBtn.addEventListener("click", function(event) {
        event.preventDefault();
        alert("Booking management page coming soon.");
    });
}

