/* =========================================
   PROJECT ENQUIRY FORM
========================================= */

const projectForm =
    document.getElementById("projectForm");


if (projectForm) {

    projectForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =====================================
            // GET FORM VALUES
            // =====================================

            const name =
                document.getElementById("name").value.trim();

            const business =
                document.getElementById("business").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const service =
                document.getElementById("service").value;

            const budget =
                document.getElementById("budget").value;

            const message =
                document.getElementById("message").value.trim();


            // =====================================
            // VALIDATION
            // =====================================

            if (
                !name ||
                !email ||
                !service ||
                !message
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            // =====================================
            // FORM DATA
            // =====================================

            const enquiryData = {

                name: name,

                business: business || null,

                email: email,

                phone: phone || null,

                service: service,

                budget: budget || null,

                message: message

            };


            // =====================================
            // SUBMIT TO FASTAPI
            // =====================================

            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/enquiries",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            enquiryData
                        )
                    }
                );


                const result =
                    await response.json();


                // =================================
                // CHECK RESPONSE
                // =================================

                if (!response.ok) {

                    throw new Error(
                        result.detail ||
                        "Something went wrong."
                    );

                }


                // =================================
                // SUCCESS
                // =================================

                if (result.success) {

                    // Your WhatsApp number
                    const whatsappNumber =
                        "919123261749";


                    const whatsappMessage =

`Hello! I found your website and I would like to discuss a project.

Name: ${name}

Business / Brand: ${business || "Not provided"}

Email: ${email}

WhatsApp / Phone: ${phone || "Not provided"}

Service Required: ${service}

Budget: ${budget || "Not decided"}

Project Details:
${message}

Enquiry ID: ${result.enquiry_id}

Looking forward to discussing the project with you.`;


                    const whatsappURL =
                        "https://wa.me/" +
                        whatsappNumber +
                        "?text=" +
                        encodeURIComponent(
                            whatsappMessage
                        );


                    alert(
                        "Your enquiry has been submitted successfully! Enquiry ID: " +
                        result.enquiry_id
                    );


                    // Open WhatsApp

                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                    // Clear form

                    projectForm.reset();

                }

            }


            // =====================================
            // ERROR HANDLING
            // =====================================

            catch (error) {

                console.error(
                    "Enquiry submission error:",
                    error
                );


                alert(
                    "Unable to submit your enquiry right now. Please try again or contact us on WhatsApp."
                );

            }

        }
    );

}