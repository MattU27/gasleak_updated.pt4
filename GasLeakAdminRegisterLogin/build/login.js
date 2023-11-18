const container = document.querySelector(".container");
const pwShowHide = document.querySelectorAll(".showHidePw");
const pwFields = document.querySelectorAll(".password");
const signUp = document.querySelector(".signup-link");
// const login = document.querySelector(".login-link"); // Commented out as it's not used
const loginForm = document.getElementById("loginForm");

let registeredUsers = [];

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show/hide password and change icon
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach(pwField => {
            if (pwField.type === "password") {
                pwField.type = "text";
                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                });
            } else {
                pwField.type = "password";
                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye", "uil-eye-slash");
                });
            }
        });
    });
});

signUp.addEventListener("click", () => {
    container.classList.add("active");
});

// login.addEventListener("click", () => { // Commented out as login is null
//     container.classList.remove("active");
// });

loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch('http://localhost:5000/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Redirect to the landing page after successful login
            window.location.pathname = "GasLeakAdminDashBoard/adminside.html";
        } else {
            alert("Invalid email or password. Please try again.");
        }
    }).catch(error => {
        console.log(error);
    });
});
