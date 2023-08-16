const socket = io("http://localhost:3000");
const formBox = document.getElementById("formBox");
const inputBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chats");
const audio = new Audio("sound.mp3");
let username;

window.addEventListener("load", () => {
    username = prompt("Enter your name to join");
    if(!username){
        while(!username){
            username = prompt("Enter your name to join");
        }
    }
    socket.emit("new-user", username);
});

const appendUser = (name, connection) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<span>${name} ${connection}</span>`;
  messageElement.classList.add("userJoined");
  chatBox.append(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const appendMessage = (name, message, time, user) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
  <div class="usermsg">
    <div class="details">
        <p class="name">${name}</p>
        <p class="time">${time}</p>
    </div>
    <div class="message">
        <p>${message}</p>
    </div> 
  </div>`;
  messageElement.classList.add("user");
  messageElement.classList.add(user);
  chatBox.append(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
  if(user === 'other')
    audio.play();
};

socket.on("user-connected", (name) => {
    if(name)
        appendUser(name, 'joined');
});

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const message = inputBox.value;
  if(message){
    socket.emit("send-chat-message", message);
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let timeString = `${hours}:${minutes}`;
    appendMessage('You', message, timeString, 'self');
  }
  inputBox.value = "";
});

socket.on("chat-message", (data) => {
  appendMessage(data.name, data.message, data.time, 'other');
});

socket.on("user-disconnected", (name) => {
    if(name)
        appendUser(name, 'left');
});

// const main = document.querySelector("main");
// const username = "username";

// console.log(username);
// if(username){
//     main.style.display = "flex";
// }
