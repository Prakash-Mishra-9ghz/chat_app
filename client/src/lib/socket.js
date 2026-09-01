import { io } from 'socket.io-client';

// autoConnect is off until Phase 1 auth exists — we'll attach the JWT to the
// handshake (auth: { token }) and call socket.connect() after login, since
// the server-side Socket.io middleware will need it to identify the user.
const socket = io({
  autoConnect: false,
});

export default socket;
