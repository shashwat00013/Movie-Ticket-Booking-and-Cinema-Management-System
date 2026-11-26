// VENDOR PROFILE MANAGEMENT
const profileForm = document.getElementById("profileForm");
// LOAD SAVED PROFILE
const savedProfile = JSON.parse(localStorage.getItem("cinebookProfile")) || {};
document.getElementById("vendorName").value = savedProfile.vendorName || "";
document.getElementById("businessName").value = savedProfile.businessName || "";
document.getElementById("vendorEmail").value = savedProfile.vendorEmail || "";
document.getElementById("vendorPhone").value = savedProfile.vendorPhone || "";
document.getElementById("vendorAddress").value = savedProfile.vendorAddress || "";

// LOAD NOTIFICATION SETTINGS
const savedSettings = JSON.parse(localStorage.getItem("cinebookSettings")) || {};

document.getElementById("emailNotifications").checked =
    savedSettings.emailNotifications !== false;

document.getElementById("smsNotifications").checked =
    savedSettings.smsNotifications || false;

// SAVE PROFILE
profileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const profile = {
        vendorName: document.getElementById("vendorName").value.trim(),
        businessName: document.getElementById("businessName").value.trim(),
        vendorEmail: document.getElementById("vendorEmail").value.trim(),
        vendorPhone: document.getElementById("vendorPhone").value.trim(),
        vendorAddress: document.getElementById("vendorAddress").value.trim()
    };

    if (!/^\d{10}$/.test(profile.vendorPhone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }
// EMAIL VALIDATION
const emailPattern =
    /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;

if (!emailPattern.test(profile.vendorEmail)) {
    alert("Please enter a valid email address.");
    return;
}


    localStorage.setItem("cinebookProfile", JSON.stringify(profile));

    alert("Profile saved successfully!");
});

// SAVE NOTIFICATION SETTINGS
function saveSettings() {
    const settings = {
        emailNotifications: document.getElementById("emailNotifications").checked,
        smsNotifications: document.getElementById("smsNotifications").checked
    };

    localStorage.setItem("cinebookSettings", JSON.stringify(settings));
}

document.getElementById("emailNotifications")
    .addEventListener("change", saveSettings);

document.getElementById("smsNotifications")
    .addEventListener("change", saveSettings);
