require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const registerSocketHandlers = require('./sockets');

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

// --- middleware ---
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// Serve the legacy static frontend for now. Once the React (Vite) client
// in /client is built, this will be swapped for serving client/dist and
// this line can be removed.
app.use(express.static(path.join(__dirname, 'public')));

// --- server + socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});

registerSocketHandlers(io);

// --- boot ---
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
