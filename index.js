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
  socket.emit('newUserJoined', socket.id)
  users.push(socket.id)

  io.emit('connectedUserCount', users.length)

  socket.on('disconnect', (reason) => {
    console.log('a user disconnected', reason);
    users.pop();
    io.emit('clientDisconnected', users.length);
  })

  socket.on('userName', async (e) => {
    console.log('userName e', e)
    const {name, socketId} = e;
    
    const socket = await io.fetchSockets(e.socketId)
    console.log('socket', socket)
    socket[0].data.userName = e.name;

    const sockets = await io.fetchSockets();
    
    console.log('all the sockets', sockets)

  })

  socket.on('userIsDrawing', (e) => {
    console.log('userIsDrawing', e)
    socket.broadcast.emit('userDrawing', e)
  })
});


server.listen(4000, () => {
  console.log('listening on *:4000');
});

