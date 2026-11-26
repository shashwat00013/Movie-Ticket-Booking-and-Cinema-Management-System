
// SETTINGS MANAGEMENT

const emailNotifications = document.getElementById("emailNotifications");
const smsNotifications = document.getElementById("smsNotifications");
const saveSettingsBtn = document.getElementById("saveSettings");
const logoutBtn = document.getElementById("logoutBtn");

// LOAD SAVED SETTINGS
const savedSettings = JSON.parse(
    localStorage.getItem("cinebookSettings")
) || {};

emailNotifications.checked = savedSettings.emailNotifications || false;
smsNotifications.checked = savedSettings.smsNotifications || false;

// SAVE SETTINGS
saveSettingsBtn.addEventListener("click", function() {

    const settings = {
        emailNotifications: emailNotifications.checked,
        smsNotifications: smsNotifications.checked
    };

    localStorage.setItem("cinebookSettings", JSON.stringify(settings));

    alert("Settings saved successfully!");
});

// LOGOUT
logoutBtn.addEventListener("click", function() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "vendor-login.html";
    }

});
