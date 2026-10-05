const questionInput =
    document.getElementById("question");

const askButton =
    document.getElementById("askButton");

const fileInput =
    document.getElementById("fileInput");

const fileName =
    document.getElementById("fileName");

const answerCard =
    document.getElementById("answerCard");

const answer =
    document.getElementById("answer");

const loading =
    document.getElementById("loading");

const documentList =
    document.getElementById("documentList");

const statusText =
    document.getElementById("statusText");


// ============================================================
// FILE SELECTION
// ============================================================

fileInput.addEventListener(
    "change",
    function () {

        if (
            fileInput.files &&
            fileInput.files.length > 0
        ) {

            fileName.textContent =
                fileInput.files[0].name;

        } else {

            fileName.textContent =
                "No file selected";
        }
    }
);


// ============================================================
// LOAD DOCUMENT LIST
// ============================================================

async function loadDocuments() {

    try {

        const response =
            await fetch("/documents");

        if (!response.ok) {
            throw new Error(
                "Could not load documents"
            );
        }

        const data =
            await response.json();

        statusText.textContent =
            "System Online";

        if (
            !data.documents ||
            data.documents.length === 0
        ) {

            documentList.innerHTML =
                "No supported documents found.";

            return;
        }

        documentList.innerHTML = "";

        data.documents.forEach(
            function (documentName) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "document-item";

                item.innerHTML =
                    `<i class="fa-regular fa-file"></i>
                     ${escapeHtml(documentName)}`;

                documentList.appendChild(
                    item
                );
            }
        );

    } catch (error) {

        statusText.textContent =
            "Backend Unavailable";

        documentList.innerHTML =
            "Could not connect to the backend.";
    }
}


// ============================================================
// ASK ASSISTANT
// ============================================================

async function askAssistant() {

    const question =
        questionInput.value.trim();

    if (!question) {

        alert(
            "Please enter a question first."
        );

        questionInput.focus();

        return;
    }


    askButton.disabled = true;

    loading.style.display =
        "block";

    answerCard.style.display =
        "none";

    answer.textContent = "";


    try {

        let response;


        // ----------------------------------------------------
        // WITH FILE
        // ----------------------------------------------------

        if (
            fileInput.files &&
            fileInput.files.length > 0
        ) {

            const formData =
                new FormData();

            formData.append(
                "question",
                question
            );

            formData.append(
                "file",
                fileInput.files[0]
            );


            response =
                await fetch(
                    "/ask-with-file",
                    {
                        method: "POST",
                        body: formData
                    }
                );
        }


        // ----------------------------------------------------
        // WITHOUT FILE
        // ----------------------------------------------------

        else {

            const formData =
                new FormData();

            formData.append(
                "question",
                question
            );


            response =
                await fetch(
                    "/ask",
                    {
                        method: "POST",
                        body: formData
                    }
                );
        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );
        }


        answer.textContent =
            data.answer ||
            "No answer was returned.";


        answerCard.style.display =
            "block";


    } catch (error) {

        answer.textContent =
            "Error: " +
            error.message;

        answerCard.style.display =
            "block";

    } finally {

        askButton.disabled =
            false;

        loading.style.display =
            "none";
    }
}


// ============================================================
// BUTTON
// ============================================================

askButton.addEventListener(
    "click",
    askAssistant
);


// ============================================================
// CTRL + ENTER
// ============================================================

questionInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            askAssistant();
        }
    }
);


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}


// ============================================================
// INITIALIZE
// ============================================================

loadDocuments();
