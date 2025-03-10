function handleInput(event) {
    if (event.key === "Enter") {
        const inputField = event.target;
        const message = inputField.value.trim();
        if (message !== "") {
            processMessage(message);
            processAnswer(message);
            inputField.value = "";
        }
    }
}

function processMessage(message) {
    console.log("User input:", message);
    const chatContainer = document.getElementById("chat-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
}

function processAnswer(message) {
    console.log("Answer:", message);
    const chatContainer = document.getElementById("chat-container");
    const answerElement = document.createElement("div");
    answerElement.classList.add("chat-answer");
    answerElement.textContent = message;
    chatContainer.appendChild(answerElement);
}