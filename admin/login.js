const API_URL = "http://127.0.0.1:8000";


// =========================================
// GET ELEMENTS
// =========================================

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");

const loginButton =
    document.getElementById("loginButton");


// =========================================
// CHECK EXISTING LOGIN
// =========================================

const existingToken =
    sessionStorage.getItem("prabhuLabsToken");

const existingAdmin =
    sessionStorage.getItem("prabhuLabsAdmin");


if (
    existingToken &&
    existingAdmin === "true"
) {

    window.location.href = "index.html";

}


// =========================================
// LOGIN FORM
// =========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Clear previous error

        loginError.textContent = "";

        loginError.style.display = "none";


        // Get username

        const username =
            document.getElementById(
                "username"
            ).value.trim();


        // Get password

        const password =
            document.getElementById(
                "password"
            ).value;


        // Basic validation

        if (
            !username ||
            !password
        ) {

            showError(
                "Please enter your username and password."
            );

            return;

        }


        // Disable button

        loginButton.disabled = true;

        loginButton.textContent =
            "SIGNING IN...";


        try {

            // =========================================
            // CREATE OAUTH2 FORM DATA
            // =========================================

            const formData =
                new URLSearchParams();


            formData.append(
                "username",
                username
            );


            formData.append(
                "password",
                password
            );


            // =========================================
            // SEND LOGIN REQUEST
            // =========================================

            const response =
                await fetch(
                    `${API_URL}/admin/login`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/x-www-form-urlencoded"

                        },

                        body:
                            formData.toString()

                    }
                );


            // =========================================
            // READ RESPONSE
            // =========================================

            const data =
                await response.json();


            console.log(
                "Login response:",
                data
            );


            // =========================================
            // LOGIN FAILED
            // =========================================

            if (!response.ok) {

                let message =
                    "Invalid username or password.";


                if (data.detail) {

                    if (
                        Array.isArray(
                            data.detail
                        )
                    ) {

                        message =
                            data.detail
                                .map(
                                    error =>
                                        error.msg ||
                                        "Login failed"
                                )
                                .join(", ");

                    } else {

                        message =
                            data.detail;

                    }

                }


                showError(
                    message
                );

                return;

            }


            // =========================================
            // CHECK TOKEN
            // =========================================

            if (
                !data.access_token
            ) {

                showError(
                    "Login succeeded, but no access token was received."
                );

                return;

            }


            // =========================================
            // SAVE ADMIN SESSION
            // =========================================

            sessionStorage.setItem(
                "prabhuLabsAdmin",
                "true"
            );


            sessionStorage.setItem(
                "prabhuLabsToken",
                data.access_token
            );


            // =========================================
            // GO TO DASHBOARD
            // =========================================

            window.location.href =
                "index.html";

        }


        catch (error) {

            console.error(
                "Login error:",
                error
            );


            showError(
                "Unable to connect to the server. Please make sure the backend is running."
            );

        }


        finally {

            loginButton.disabled =
                false;

            loginButton.textContent =
                "SIGN IN";

        }

    }
);


// =========================================
// SHOW ERROR
// =========================================

function showError(message) {

    loginError.textContent =
        message;

    loginError.style.display =
        "block";

}