
// VENDOR REGISTRATION

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const businessName = document.getElementById("businessName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const mobile = document.getElementById("mobileNumber").value.trim();
    const address = document.getElementById("businessAddress").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // EMAIL VALIDATION
    const emailPattern =
        /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // MOBILE NUMBER VALIDATION
    if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return;
    }

    // PASSWORD VALIDATION
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    if (!passwordPattern.test(password)) {
        alert("Password must contain 8 characters, uppercase, lowercase, number and special character.");
        return;
    }

    // CONFIRM PASSWORD
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // SAVE REGISTRATION
    const vendor = {
        fullName,
        businessName,
        email,
        mobile,
        address,
        password
    };

    let vendors = JSON.parse(localStorage.getItem("cinebookVendors")) || [];

    if (vendors.some(item => item.email.toLowerCase() === email.toLowerCase())) {
        alert("This email is already registered.");
        return;
    }

    vendors.push(vendor);

    localStorage.setItem("cinebookVendors", JSON.stringify(vendors));

    alert("Registration successful!");

    window.location.href = "vendor-login.html";
});
