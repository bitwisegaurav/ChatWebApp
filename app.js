const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {};

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    if(name)
      socket.broadcast.emit("user-connected", name);
    // broadcast to all other users
  });
  socket.on("send-chat-message", (message) => {
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let timeString = `${hours}:${minutes}`;
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
      time: timeString,
    });
    // broadcast to all other users
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
    // broadcast to all other users
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 80;

// // change content type for css and js files to text/css and text/javascript
// // app.use((req, res, next) => {
// //     if (req.url.endsWith('.css')) {
// //         res.contentType('text/css');
// //     } else if (req.url.endsWith('.js')) {
// //         res.contentType('text/javascript');
// //     }
// //     next();
// // });
// app.use(express.static(path.join(__dirname, 'files')));

// app.get('/', (req, res) => {
// //   res.send('Hello World!');
//   res.sendFile(__dirname + '/files/index.html');
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
