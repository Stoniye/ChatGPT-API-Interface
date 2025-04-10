let APIKey = localStorage.getItem('apiKey');
let modelName = localStorage.getItem('modelName');
let usedTokens = parseInt(localStorage.getItem('usedTokens'));

//Elements
const messageInput = document.getElementById('messageInput');
const chatContainer = document.getElementById("chatContainer");

//Event Listener
messageInput.addEventListener('focus', scaleInput);
messageInput.addEventListener('blur', shrinkInput);
messageInput.addEventListener('keydown', function(e) {handleKey(e)});
document.getElementById("apiInput").addEventListener('input', handleAPIInput);
document.getElementById('newChatButton').addEventListener('click', createNewChat);

//Process Variables
const testMode = false;
let chatHistory = [];
let chatID = generateRandomString(5);

//UI HANDLING//
function onLoad(){
    defaultValues();
    document.getElementById('settingsContainer').style.display = 'none';
    loadAllChats();
}

function defaultValues(){
    if(isNaN(usedTokens)){
        usedTokens = 0;
    }

    if(modelName == null){
        modelName = 'gpt-4o-mini';
    }
}

document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('usedTokensLabel').textContent = usedTokens;
    document.getElementById('apiInput').value = APIKey;
    document.getElementById('modelInput').value = modelName;
    document.getElementById('settingsContainer').style.display = 'block';
});

document.getElementById('settingsCloseButton').addEventListener('click', () => {
    document.getElementById('settingsContainer').style.display = 'none';
});

function scaleInput() {
    this.style.height = 100 + 'px';
}

function shrinkInput() {
    this.style.height = 20 + 'px';
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
    if (message === "" || message === null)
        return;

    if(APIKey == null || APIKey === "") {
        alert("API key is required, no API Key provided.\n\nIf you need a Tutorial:\nhttps://github.com/Stoniye/ChatGPT-API-Interface?tab=readme-ov-file#how-to-set-up-chatgpt-in-5-minutes");
        return;
    }

    const messageElement = document.createElement("div");

    if (user){
        messageElement.classList.add("chat-message");
    }
    else{
        messageElement.classList.add("chat-answer");
    }

    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);

    saveChatHistory(chatID, message);

    if(user)
        APICall(message);
}

function loadAllChats(){
    const chats = loadAllChatHistories();
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    chats.forEach(chat => {
        const newButton = document.createElement('button');

        newButton.className = 'sidebar-button';
        newButton.innerHTML = `<p>${chat.id}</p><button>D</button>`;

        sidebar.appendChild(newButton);

        newButton.addEventListener('click', function() {
            displayChatHistory(chat.id);
            chatID = chat.id;
        });

        newButton.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            if (chatID === chat.id)
                createNewChat();
            deleteChat(chat.id);
        })
    })
}

function deleteChat(chatID, parent){
    localStorage.removeItem('chatHistory_' + chatID);
    loadAllChats();
}

function loadAllChatHistories() {
    const chatHistories = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith('chatHistory_')) {
            const id = key.replace('chatHistory_', '');
            const history = JSON.parse(localStorage.getItem(key)) || [];
            chatHistories.push({ id, history });
        }
    }

    return chatHistories;
}


function loadChatHistoryById(id) {
    return JSON.parse(localStorage.getItem('chatHistory_' + id)) || [];
}

function clearChat() {
    const existingMessages = chatContainer.querySelectorAll('.chat-message, .chat-answer');
    existingMessages.forEach(message => message.remove());
}

function displayChatHistory(id) {
    clearChat();

    chatHistory = loadChatHistoryById(id);
    let user = true;

    chatHistory.forEach(message => {
        const messageElement = document.createElement("div");

        if (user){
            messageElement.classList.add("chat-message");
        }
        else{
            messageElement.classList.add("chat-answer");
        }

        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);

        user = !user;
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function saveChatHistory(id, newMessage) {
    let existed = true;
    if (localStorage.getItem('chatHistory_' + id) == null)
        existed = false;

    chatHistory.push(newMessage);
    localStorage.setItem('chatHistory_' + id, JSON.stringify(chatHistory));

    if(!existed)
        loadAllChats();
}

function APICall(message) {
    if(testMode){
        processMessage("This is a Test Message", false);
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
            model: modelName,
            messages: [
                {role: "system", content: "You are a helpful AI, the Chat History is: \n" + chatHistory + "The user made a new prompt, continue the Chat"},
                {role: "user", content: message }
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
            // Process the message
            processMessage(data.choices[0].message.content, false);

            // Log token usage
            usedTokens += data.usage.total_tokens;
            localStorage.setItem('usedTokens', usedTokens.toString());
        })
        .catch(error => {
            console.error("Error:", error);
            processMessage("An error occurred while fetching response from the ChatGPT API. Check Console for Error Messages", false);
        });
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createNewChat() {
    chatHistory = [];
    chatID = generateRandomString(5);
    clearChat();
}