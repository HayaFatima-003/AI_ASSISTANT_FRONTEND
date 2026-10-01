
// ============================================
// KHT AI ASSISTANT — FRONTEND
// ============================================


// Backend URL will be added after
// the FastAPI backend is deployed.

const BACKEND_URL = "";


// ============================================
// SET QUICK QUESTION
// ============================================

function setQuestion(question) {

    const questionInput =
        document.getElementById("question");

    questionInput.value =
        question;

    questionInput.focus();

}


// ============================================
// ASK QUESTION
// ============================================

async function askQuestion() {

    const questionInput =
        document.getElementById("question");

    const responseBox =
        document.getElementById("response");

    const answerBox =
        document.getElementById("answer");

    const sourceBox =
        document.getElementById("source");

    const askButton =
        document.getElementById("askButton");


    const question =
        questionInput.value.trim();


    // ========================================
    // EMPTY QUESTION
    // ========================================

    if (!question) {

        alert(
            "Please enter a question."
        );

        return;

    }


    // ========================================
    // BACKEND NOT CONNECTED YET
    // ========================================

    if (!BACKEND_URL) {

        responseBox.style.display =
            "block";

        answerBox.innerHTML = `

            <strong>
                Frontend ready
            </strong>

            <p style="margin-top:10px;">

                The KHT AI Assistant frontend
                is ready.

                <br><br>

                The backend connection will be
                added after the OpenAI-powered
                FastAPI backend is deployed.

            </p>

        `;

        sourceBox.innerHTML =
            "📖 Status: Frontend ready";

        return;

    }


    // ========================================
    // LOADING STATE
    // ========================================

    responseBox.style.display =
        "block";


    answerBox.innerHTML = `

        <div class="loading">

            <span class="loading-dot"></span>

            <span>
                KHT AI Assistant is thinking...
            </span>

        </div>

    `;


    sourceBox.innerHTML =
        "📖 Source: Searching KHT knowledge base...";


    askButton.disabled =
        true;


    try {


        // ====================================
        // SEND QUESTION TO BACKEND
        // ====================================

        const response = await fetch(

            BACKEND_URL +
            "/ask",

            {

                method:
                    "POST",

                headers:
                    {
                        "Content-Type":
                            "application/json"
                    },

                body:
                    JSON.stringify({
                        question:
                            question
                    })

            }

        );


        // ====================================
        // CHECK HTTP RESPONSE
        // ====================================

        if (!response.ok) {

            throw new Error(
                "Backend returned HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "KHT Backend Response:",
            data
        );


        // ====================================
        // DISPLAY ANSWER
        // ====================================

        answerBox.innerHTML = `

            <strong>
                💡 KHT AI Assistant
            </strong>

            <p style="margin-top:10px;">
                ${escapeHtml(
                    data.answer || 
                    "No answer was returned."
                )}
            </p>

        `;


        // ====================================
        // DISPLAY SOURCE
        // ====================================

        sourceBox.innerHTML =
            "📖 Source: " +
            escapeHtml(
                data.source ||
                "KHT Knowledge Base"
            );


    }


    catch (error) {

        console.error(
            "KHT Assistant Error:",
            error
        );


        answerBox.innerHTML = `

            <strong>
                ⚠️ Unable to connect
            </strong>

            <p style="margin-top:10px;">

                The KHT AI Assistant could not
                retrieve a response.

                <br><br>

                Please try again.

            </p>

        `;


        sourceBox.innerHTML =
            "📖 Source: Backend unavailable.";

    }


    finally {

        askButton.disabled =
            false;

    }

}


// ============================================
// BASIC HTML ESCAPING
// ============================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


// ============================================
// ENTER KEY
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const questionInput =
            document.getElementById("question");


        questionInput.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    askQuestion();

                }

            }
        );

    }
);
