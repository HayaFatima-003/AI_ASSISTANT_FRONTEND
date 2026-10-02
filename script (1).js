const BACKEND_URL = :"https://ai-assistant-chatbot-backend.onrender.com";

const response = await fetch(`${BACKEND_URL}/ask`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        question: userQuestion
    })
});

const data = await response.json();
