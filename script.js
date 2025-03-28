let APIKey = localStorage.getItem('apiKey');

//Elements
const messageInput = document.getElementById('messageInput');
const chatContainer = document.getElementById("chatContainer");
const apiContainer = document.getElementById("apiContainer");
const apiInput = document.getElementById('apiInput');

const roundedButton = document.querySelector('.rounded-button');

//Event Listener
messageInput.addEventListener('input', handleInputSize);
messageInput.addEventListener('keydown', function(e) {handleKey(e)});
apiInput.addEventListener('input', handleAPIInput);

//Process Variables
const testMode = false;


//UI HANDLING//
function onLoad(){
    apiContainer.style.display = 'none';
}

roundedButton.addEventListener('click', () => {
    if (apiContainer.style.display === 'none') {
        apiInput.value = APIKey;
        apiContainer.style.display = 'block';
    } else {
        apiContainer.style.display = 'none';
    }
});

function handleInputSize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    const maxHeight = 250;
    if (this.scrollHeight > maxHeight) {
        this.style.height = maxHeight + 'px';
        this.style.overflowY = 'scroll';
    } else {
        this.style.overflowY = 'hidden';
    }
}

function handleAPIInput() {
    localStorage.setItem('apiKey', apiInput.value);
    APIKey = apiInput.value;
}

function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        processMessage(messageInput.value, true);
        messageInput.value = '';
    }
}

//MESSAGE HANDLING//
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
        console.log(APIKey);
        processMessage("Test mode is active, no API Call", false);
        return;
    }

    if(APIKey === ""){
        throw new Error("No API Key provided");
        return;
    }

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
    })
    .then(data => {
        processMessage(data.choices[0].message.content, false);
    })
    .catch(error => {
        console.error("Error:", error);
        processMessage("An error occurred while fetching response from the ChatGPT API. Check Console for Error Messages", false);
    });
}