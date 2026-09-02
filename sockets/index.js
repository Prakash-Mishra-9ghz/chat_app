const socketAuth = require('../middleware/socketAuth.middleware');

const socketCount = new Set();

function registerSocketHandlers(io) {
  io.use(socketAuth);
  io.on('connection', (socket) => onConnected(io, socket));
}

function onConnected(io, socket) {
  console.log(socket.id);
  socketCount.add(socket.id);

  io.emit('clients-total', socketCount.size);

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
    socketCount.delete(socket.id);
    io.emit('clients-total', socketCount.size);
  });

  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
  });
}

module.exports = registerSocketHandlers;
