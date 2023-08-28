const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const users = [];

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

//socket.emit goes to the specific client
//io.emit goes to all connected clients

io.on('connection', async (socket) => {
  console.log('a user connected', socket.id);
  io.emit('newUserJoined', socket.id)
  users.push(socket.id)
  io.emit('connectedUserCount', users.length)

  socket.on('disconnect', (e) => {
    console.log('a user disconnected', e);
    users.pop();
    io.emit('clientDisconnected', users.length);
  })

  socket.on('userName', async (e) => {
    const {name, socketId} = e;
    
    const socket = await io.fetchSockets(socketId)
    socket.data.username = name;
  })

  const sockets = await io.fetchSockets();
  console.log('sockets', sockets)
});


server.listen(4000, () => {
  console.log('listening on *:4000');
});

