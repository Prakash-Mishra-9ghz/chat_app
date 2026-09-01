// Socket.io connection handling.
//
// NOTE: this still contains the original single-broadcast-room behavior
// from the pre-upgrade app. It will be replaced with room-aware handlers
// (join-room, send-message, typing, presence, etc.) starting in Phase 3.
// Kept as-is here so Phase 0 is a pure restructure with no behavior change.

const socketCount = new Set();

function registerSocketHandlers(io) {
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
