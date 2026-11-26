const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const toast = document.getElementById("toast");
// Show / Hide Password
togglePassword.addEventListener("click", function() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } 
    else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});
// Toast Message
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);
}
// Login Form
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    // Email Validation
    const emailPattern =
    /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;
    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email address.");
        return;
    }
    // Password Validation
    const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordPattern.test(password)) {
        showToast("Password must meet all security requirements.");
        return;
    }
    // CHECK REGISTERED VENDOR
const vendors = JSON.parse(
    localStorage.getItem("cinebookVendors")
) || [];

const matchedVendor = vendors.find(vendor =>
    vendor.email.toLowerCase() === email.toLowerCase() &&
    vendor.password === password
);

if (!matchedVendor) {
    showToast("Invalid email or password.");
    return;
}

// SAVE LOGIN SESSION
localStorage.setItem("loggedInVendor", JSON.stringify({
    fullName: matchedVendor.fullName,
    email: matchedVendor.email,
    businessName: matchedVendor.businessName
}));

alert("Login successful! Welcome to CineBook.");

window.location.href = "dashboard.html";
});
// Forgot Password
document.getElementById("forgotPassword")
.addEventListener("click", function(event) {
    event.preventDefault();
    showToast("Password recovery will be available soon.");
});
// Contact Support
// Help & Support
document.querySelector(".support-link")
.addEventListener("click", function(event) {
    event.preventDefault();
    showToast("Support section coming soon.");
});
