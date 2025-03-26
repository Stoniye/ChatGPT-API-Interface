var APIKey = "";
const chatContainer = document.getElementById("chat-container");
const testMode = false;

function handleInput(event) {
    if (event.key === "Enter") {
        const inputField = event.target;
        const message = inputField.value.trim();
        if (message !== "") {
            processMessage(message, true);
            inputField.value = "";
        }
    }
}

function processMessage(message, user) {
    const messageElement = document.createElement("div");
    if (user)
        messageElement.classList.add("chat-message");
    else
        messageElement.classList.add("chat-answer");

    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);

    if (user)
        APICall(message);
}

function APICall(message) {
    if(testMode){
        processMessage("Test mode is active, no API Call", false);
        return;
    }

    APIKey = document.getElementById("key-input").value.trim();
    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + APIKey
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: message }
            ]
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const answer = data.choices[0].message.content;
            processMessage(answer, false);
        })
        .catch(error => {
            console.error("Error:", error);
            processMessage("An error occurred while fetching response from the ChatGPT API. Check Console for Error Messages", false);
        });
}