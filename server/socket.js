const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', (socket) => {
  socket.on('userJoin', (data) => {
    users[socket.id] = data;
    socket.broadcast.emit('userHasJoined', { user: data });
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
  });

  socket.on('sendFile', ({ file, fileName, fileType }) => {
    if (fileType === 'audio') {
      console.log("hii");
      io.emit('receiveAudio', { file, fileName });
    } else if (fileType === 'video') {
      io.emit('receiveVideo', { file, fileName });
    } else {
      io.emit('receiveFile', { file, fileName }); // Assuming default for images
    }
  });

  socket.on('disconnect',name=>{
    socket.broadcast.emit('left',users[socket.id])
    delete users[socket.id]
  })
});

io.listen(4000);
