// ==========================================
// KHT AI ASSISTANT - FRONTEND
// ==========================================

const BACKEND_URL = "https://ai-assistant-chatbot-backend.onrender.com";


// ==========================================
// ASK QUESTION
// ==========================================

async function askQuestion() {

    const questionInput = document.getElementById("question");
    const askButton = document.getElementById("askButton");
    const responseCard = document.getElementById("response");
    const answerBox = document.getElementById("answer");
    const sourceBox = document.getElementById("source");

    const userQuestion = questionInput.value.trim();

    // Don't send empty questions
    if (!userQuestion) {
        answerBox.innerHTML = "Please enter a question first.";
        responseCard.style.display = "block";
        sourceBox.textContent = "";
        return;
    }


    // ==========================================
    // LOADING STATE
    // ==========================================

    askButton.disabled = true;
    askButton.innerHTML = "Thinking...";

    responseCard.style.display = "block";

    answerBox.innerHTML = `
        <div class="loading">
            <span class="loading-dot"></span>
            <span>Searching KHT knowledge...</span>
        </div>
    `;

    sourceBox.textContent = "";


    try {

        // ==========================================
        // SEND QUESTION TO RENDER BACKEND
        // ==========================================

        const response = await fetch(`${BACKEND_URL}/ask`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: userQuestion
            })

        });


        // ==========================================
        // CHECK BACKEND RESPONSE
        // ==========================================

        if (!response.ok) {

            throw new Error(
                `Backend returned status ${response.status}`
            );

        }


        const data = await response.json();


        // ==========================================
        // DISPLAY ANSWER
        // ==========================================

        if (data.answer) {

            // Convert line breaks into HTML
            answerBox.innerHTML = data.answer
                .replace(/\n/g, "<br>");

        } else {

            answerBox.textContent =
                "The assistant did not return an answer.";

        }


        // ==========================================
        // DISPLAY SOURCE
        // ==========================================

        if (data.source) {

            sourceBox.textContent =
                `Source: ${data.source}`;

        } else {

            sourceBox.textContent =
                "Source: KHT Knowledge Base";

        }


    } catch (error) {

        console.error(
            "KHT AI Assistant Error:",
            error
        );


        // ==========================================
        // ERROR MESSAGE
        // ==========================================

        answerBox.innerHTML = `
            <strong>Unable to connect to the KHT AI Assistant.</strong>
            <br><br>
            Please try again in a moment.
        `;

        sourceBox.textContent = "";

    }


    // ==========================================
    // RESTORE BUTTON
    // ==========================================

    askButton.disabled = false;

    askButton.innerHTML = `
        Ask Assistant
        <span>→</span>
    `;

}


// ==========================================
// QUICK QUESTIONS
// ==========================================

function setQuestion(question) {

    const questionInput =
        document.getElementById("question");

    questionInput.value = question;

    questionInput.focus();

}
