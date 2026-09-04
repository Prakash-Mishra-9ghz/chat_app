const express = require('express');
const requireAuth = require('../middleware/auth.middleware');
const {
  createRoom,
  listAllRooms,
  listMyRooms,
  joinRoom,
  leaveRoom,
} = require('../controllers/room.controller');

const router = express.Router();

// All room routes require a logged-in user.
router.use(requireAuth);

router.post('/', createRoom);
router.get('/', listAllRooms);
router.get('/mine', listMyRooms);
router.post('/:id/join', joinRoom);
router.post('/:id/leave', leaveRoom);

module.exports = router;
