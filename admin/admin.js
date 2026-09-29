const API_URL = "http://127.0.0.1:8000";


// =========================================
// ELEMENTS
// =========================================

const enquiriesContainer =
    document.getElementById("enquiriesContainer");

const logoutBtn =
    document.getElementById("logoutBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const searchInput =
    document.getElementById("searchEnquiries");
const serviceFilter =
    document.getElementById("serviceFilter");


// =========================================
// ADMIN LOGIN CHECK
// =========================================

const isAdmin =
    sessionStorage.getItem("prabhuLabsAdmin");

const savedToken =
    sessionStorage.getItem("prabhuLabsToken");


if (
    isAdmin !== "true" ||
    !savedToken
) {
    window.location.href = "login.html";
}


// =========================================
// STORE ALL ENQUIRIES
// =========================================

let allEnquiries = [];


// =========================================
// LOAD ENQUIRIES
// =========================================

async function loadEnquiries() {

    if (!enquiriesContainer) {
        return;
    }


    enquiriesContainer.innerHTML = `
        <div class="loading">
            Loading enquiries...
        </div>
    `;


    try {

        const token =
            sessionStorage.getItem(
                "prabhuLabsToken"
            );


        if (!token) {

            window.location.href =
                "login.html";

            return;
        }


        // =========================================
        // FETCH ENQUIRIES
        // =========================================

        const response =
            await fetch(
                `${API_URL}/enquiries`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Accept":
                            "application/json"
                    }
                }
            );


        // =========================================
        // UNAUTHORIZED
        // =========================================

        if (response.status === 401) {

            sessionStorage.removeItem(
                "prabhuLabsAdmin"
            );

            sessionStorage.removeItem(
                "prabhuLabsToken"
            );

            window.location.href =
                "login.html";

            return;
        }


        // =========================================
        // SERVER ERROR
        // =========================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        // =========================================
        // GET RESPONSE DATA
        // =========================================

        const data =
            await response.json();


        console.log(
            "Enquiries received:",
            data
        );


        // =========================================
        // SAVE ALL ENQUIRIES
        // =========================================

        allEnquiries =
            Array.isArray(data)
                ? data
                : [];


        // =========================================
        // DISPLAY STATS
        // =========================================

        displayStats(
            allEnquiries
        );


        // =========================================
        // DISPLAY ENQUIRIES
        // =========================================

        displayEnquiries(
            allEnquiries
        );

    }


    catch (error) {

        console.error(
            "Error loading enquiries:",
            error
        );


        enquiriesContainer.innerHTML = `
            <div class="empty">

                <h3>
                    Unable to load enquiries
                </h3>

                <p>
                    Please make sure the
                    FastAPI server is running.
                </p>

            </div>
        `;
    }
}


// =========================================
// DISPLAY DASHBOARD STATS
// =========================================

function displayStats(enquiries) {

    const totalElement =
        document.getElementById(
            "totalEnquiries"
        );


    const websiteElement =
        document.getElementById(
            "websiteProjects"
        );


    const otherElement =
        document.getElementById(
            "otherProjects"
        );


    // =========================================
    // TOTAL
    // =========================================

    if (totalElement) {

        totalElement.textContent =
            enquiries.length;
    }


    // =========================================
    // WEBSITE PROJECTS
    // =========================================

    const websiteKeywords = [

        "website",

        "web",

        "web development",

        "web design",

        "ecommerce",

        "e-commerce",

        "landing page"

    ];


    const websiteCount =
        enquiries.filter(
            enquiry => {

                const service =
                    (
                        enquiry.service ||
                        ""
                    ).toLowerCase();


                return websiteKeywords.some(
                    keyword =>
                        service.includes(
                            keyword
                        )
                );
            }
        ).length;


    if (websiteElement) {

        websiteElement.textContent =
            websiteCount;
    }


    // =========================================
    // OTHER PROJECTS
    // =========================================

    const otherCount =
        enquiries.length -
        websiteCount;


    if (otherElement) {

        otherElement.textContent =
            otherCount;
    }
}


// =========================================
// DISPLAY ENQUIRIES
// =========================================

function displayEnquiries(enquiries) {

    if (!enquiriesContainer) {
        return;
    }


    // =========================================
    // NO RESULTS
    // =========================================

    if (
        !enquiries ||
        enquiries.length === 0
    ) {

        enquiriesContainer.innerHTML = `
            <div class="empty">

                <h3>
                    No enquiries found
                </h3>

                <p>
                    Try a different search.
                </p>

            </div>
        `;

        return;
    }


    // =========================================
    // CREATE CARDS
    // =========================================

    enquiriesContainer.innerHTML =
        enquiries.map(
            enquiry => {

                return `

                    <div
                        class="enquiry-card"
                        data-id="${enquiry.id}"
                    >

                        <div class="enquiry-header">

                            <div>

                                <h3>
                                    ${escapeHTML(
                    enquiry.name
                )}
                                </h3>

                                <p class="enquiry-business">

                                    ${escapeHTML(
                    enquiry.business ||
                    "No business name"
                )}

                                </p>

                            </div>


                            <span class="enquiry-id">

                                #${enquiry.id}

                            </span>

                        </div>


                        <div class="enquiry-info">

                            <div>

                                <span>
                                    Email
                                </span>

                                <p>
                                    ${escapeHTML(
                    enquiry.email
                )}
                                </p>

                            </div>


                            <div>

                                <span>
                                    Phone
                                </span>

                                <p>

                                    ${escapeHTML(
                    enquiry.phone ||
                    "Not provided"
                )}

                                </p>

                            </div>


                            <div>

                                <span>
                                    Service
                                </span>

                                <p>

                                    ${escapeHTML(
                    enquiry.service ||
                    "Not specified"
                )}

                                </p>

                            </div>


                            <div>

                                <span>
                                    Budget
                                </span>

                                <p>

                                    ${escapeHTML(
                    enquiry.budget ||
                    "Not specified"
                )}

                                </p>

                            </div>

                        </div>


                        <div class="enquiry-message">

                            <span>
                                Message
                            </span>

                            <p>

                                ${escapeHTML(
                    enquiry.message ||
                    "No message"
                )}

                            </p>

                        </div>


                        <div class="enquiry-footer">

    <small>

        ${formatDate(
                    enquiry.created_at
                )}

    </small>


    <div class="enquiry-actions">

        <button
            class="view-btn"
            onclick="viewEnquiry(${enquiry.id})"
        >

            View Details

        </button>


        <button
            class="delete-btn"
            onclick="deleteEnquiry(${enquiry.id})"
        >

            Delete

        </button>

    </div>

</div>

                    </div>

                `;
            }
        ).join("");
}


// =========================================
// SEARCH ENQUIRIES
// =========================================
// =========================================
// SEARCH + SERVICE FILTER
// =========================================

function filterEnquiries() {

    const searchTerm =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedService =
        serviceFilter
            ? serviceFilter.value
            : "all";


    const filteredEnquiries =
        allEnquiries.filter(
            enquiry => {

                // =========================================
                // SEARCH
                // =========================================

                const name =
                    (
                        enquiry.name ||
                        ""
                    ).toLowerCase();


                const business =
                    (
                        enquiry.business ||
                        ""
                    ).toLowerCase();


                const email =
                    (
                        enquiry.email ||
                        ""
                    ).toLowerCase();


                const phone =
                    (
                        enquiry.phone ||
                        ""
                    ).toLowerCase();


                const service =
                    (
                        enquiry.service ||
                        ""
                    ).toLowerCase();


                const budget =
                    (
                        enquiry.budget ||
                        ""
                    ).toLowerCase();


                const message =
                    (
                        enquiry.message ||
                        ""
                    ).toLowerCase();


                const matchesSearch =

                    !searchTerm ||

                    name.includes(searchTerm) ||

                    business.includes(searchTerm) ||

                    email.includes(searchTerm) ||

                    phone.includes(searchTerm) ||

                    service.includes(searchTerm) ||

                    budget.includes(searchTerm) ||

                    message.includes(searchTerm);


                // =========================================
                // SERVICE FILTER
                // =========================================

                let matchesService = true;


                if (
                    selectedService ===
                    "website"
                ) {

                    matchesService =
                        service.includes("website") ||
                        service.includes("web design") ||
                        service.includes("web development") ||
                        service.includes("ecommerce") ||
                        service.includes("e-commerce") ||
                        service.includes("landing page");

                }


                else if (
                    selectedService ===
                    "telegram"
                ) {

                    matchesService =
                        service.includes("telegram") ||
                        service.includes("bot");

                }


                else if (
                    selectedService ===
                    "webapp"
                ) {

                    matchesService =
                        service.includes("web app") ||
                        service.includes("webapp") ||
                        service.includes("application");

                }


                else if (
                    selectedService ===
                    "other"
                ) {

                    const isWebsite =
                        service.includes("website") ||
                        service.includes("web design") ||
                        service.includes("web development") ||
                        service.includes("ecommerce") ||
                        service.includes("e-commerce") ||
                        service.includes("landing page");


                    const isTelegram =
                        service.includes("telegram") ||
                        service.includes("bot");


                    const isWebApp =
                        service.includes("web app") ||
                        service.includes("webapp") ||
                        service.includes("application");


                    matchesService =
                        !isWebsite &&
                        !isTelegram &&
                        !isWebApp;

                }


                return (
                    matchesSearch &&
                    matchesService
                );

            }
        );


    displayEnquiries(
        filteredEnquiries
    );
}


// =========================================
// SEARCH INPUT
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterEnquiries
    );

}


// =========================================
// SERVICE FILTER
// =========================================

if (serviceFilter) {

    serviceFilter.addEventListener(
        "change",
        filterEnquiries
    );

}







// =========================================
// VIEW SINGLE ENQUIRY
// =========================================

async function viewEnquiry(id) {

    try {

        const token =
            sessionStorage.getItem(
                "prabhuLabsToken"
            );


        if (!token) {

            window.location.href =
                "login.html";

            return;
        }


        const response =
            await fetch(
                `${API_URL}/enquiries`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Accept":
                            "application/json"
                    }
                }
            );


        if (response.status === 401) {

            sessionStorage.removeItem(
                "prabhuLabsAdmin"
            );

            sessionStorage.removeItem(
                "prabhuLabsToken"
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to fetch enquiry."
            );
        }


        const enquiries =
            await response.json();


        const enquiry =
            enquiries.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!enquiry) {

            alert(
                "Enquiry not found."
            );

            return;
        }


        showEnquiryModal(
            enquiry
        );

    }


    catch (error) {

        console.error(
            "Error viewing enquiry:",
            error
        );


        alert(
            "Unable to load enquiry details."
        );
    }
}


// =========================================
// SHOW ENQUIRY MODAL
// =========================================

function showEnquiryModal(enquiry) {

    const existingModal =
        document.getElementById(
            "enquiryModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "enquiryModal";


    modal.className =
        "enquiry-modal";


    modal.innerHTML = `

        <div class="modal-overlay">

            <div class="modal-content">

                <button
                    class="modal-close"
                    id="closeEnquiryModal"
                >
                    ×
                </button>


                <p class="modal-label">

                    ENQUIRY #${enquiry.id}

                </p>


                <h2>

                    ${escapeHTML(
        enquiry.name
    )}

                </h2>


                <div class="modal-business">

                    ${escapeHTML(
        enquiry.business ||
        "No business name"
    )}

                </div>


                <div class="modal-section">

                    <h4>
                        Contact Information
                    </h4>


                    <p>

                        <strong>
                            Email:
                        </strong>

                        ${escapeHTML(
        enquiry.email
    )}

                    </p>


                    <p>

                        <strong>
                            Phone:
                        </strong>

                        ${escapeHTML(
        enquiry.phone ||
        "Not provided"
    )}

                    </p>

                </div>


                <div class="modal-section">

                    <h4>
                        Project Information
                    </h4>


                    <p>

                        <strong>
                            Service:
                        </strong>

                        ${escapeHTML(
        enquiry.service ||
        "Not specified"
    )}

                    </p>


                    <p>

                        <strong>
                            Budget:
                        </strong>

                        ${escapeHTML(
        enquiry.budget ||
        "Not specified"
    )}

                    </p>

                </div>


                <div class="modal-section">

                    <h4>
                        Customer Message
                    </h4>


                    <div class="modal-message">

                        ${escapeHTML(
        enquiry.message ||
        "No message"
    )}

                    </div>

                </div>


                <div class="modal-section">

                    <h4>
                        Submitted
                    </h4>


                    <p>

                        ${formatDate(
        enquiry.created_at
    )}

                    </p>

                </div>


                <div class="modal-actions">

                    ${enquiry.phone
            ?
            `
                            <a
                                href="tel:${escapeHTML(
                enquiry.phone
            )}"
                                class="modal-action"
                            >

                                Call Client

                            </a>
                        `
            :
            ""
        }


                    ${enquiry.email
            ?
            `
                            <a
                                href="mailto:${escapeHTML(
                enquiry.email
            )}"
                                class="modal-action"
                            >

                                Email Client

                            </a>
                        `
            :
            ""
        }

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // =========================================
    // CLOSE BUTTON
    // =========================================

    const closeButton =
        document.getElementById(
            "closeEnquiryModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

    }


    // =========================================
    // CLOSE OUTSIDE
    // =========================================

    const overlay =
        modal.querySelector(
            ".modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    modal.remove();

                }

            }
        );

    }
}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(date) {

    if (!date) {

        return "Date unavailable";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return parsedDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"
        }
    );
}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// =========================================
// LOGOUT
// =========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "prabhuLabsAdmin"
            );


            sessionStorage.removeItem(
                "prabhuLabsToken"
            );


            window.location.href =
                "login.html";

        }
    );
}


// =========================================
// REFRESH
// =========================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        function () {

            loadEnquiries();

        }
    );
}

// =========================================
// DELETE ENQUIRY
// =========================================

async function deleteEnquiry(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this enquiry?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const token =
            sessionStorage.getItem(
                "prabhuLabsToken"
            );


        if (!token) {

            window.location.href =
                "login.html";

            return;

        }


        const response =
            await fetch(
                `${API_URL}/enquiries/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Accept":
                            "application/json"

                    }

                }
            );


        // =========================================
        // TOKEN EXPIRED
        // =========================================

        if (
            response.status === 401
        ) {

            sessionStorage.removeItem(
                "prabhuLabsAdmin"
            );

            sessionStorage.removeItem(
                "prabhuLabsToken"
            );


            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            const errorData =
                await response.json()
                    .catch(
                        () => ({})
                    );


            throw new Error(
                errorData.detail ||
                "Unable to delete enquiry."
            );

        }


        const result =
            await response.json();


        console.log(
            result
        );


        // =========================================
        // RELOAD ENQUIRIES
        // =========================================

        await loadEnquiries();


        alert(
            "Enquiry deleted successfully."
        );


    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete enquiry."
        );

    }

}
// =========================================
// INITIAL LOAD
// =========================================

loadEnquiries();