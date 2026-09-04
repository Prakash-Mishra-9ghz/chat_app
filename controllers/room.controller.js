const bcrypt = require('bcrypt');
const Room = require('../models/Room');

const SALT_ROUNDS = 10;

// POST /api/rooms
async function createRoom(req, res) {
  const { name, type, password } = req.body;

  if(!name || type !== 'public' && type !== 'private') {
    return res.status(400).json({ error: 'Name and type are required' });
  }

  if(type === 'private' && !password) {
    return res.status(400).json({ error: 'Password is required for private rooms' });
  }

  let passwordHash = null;
  if(type === 'private') {
    passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  const newRoom = new Room({
    name,
    type,
    passwordHash,
    createdBy: req.user,
    memberIds: [req.user],
  })

  try {
    await newRoom.save();
    return res.status(201).json({
      _id: newRoom._id,
      name: newRoom.name,
      type: newRoom.type,
      createdBy: newRoom.createdBy,
      memberIds: newRoom.memberIds,
      lastMessageAt: newRoom.lastMessageAt,
    });
  }catch(err) {
    return res.status(500).json({ message: 'unexpected error found' });
  }
}

// GET /api/rooms
// Public room browser — list all rooms, regardless of membership.
async function listAllRooms(req, res) {
  try {
    const allRooms = await Room.find().select('-passwordHash');

    const roomsWithMemberCount = allRooms.map(room => ({
      _id: room._id,
      name: room.name,
      type: room.type,
      createdBy: room.createdBy,
      memberCount: room.memberIds.length,
      lastMessageAt: room.lastMessageAt,
    }))

    return res.status(200).json(roomsWithMemberCount);
  }catch(err) {
    return res.status(500).json({ message: 'unexpected error found' });
  }
}

// GET /api/rooms/mine
// Rooms the logged-in user is already a member of (public or private).
async function listMyRooms(req, res) {
  try {
    const myRooms = await Room.find({ memberIds: req.user}).select('-passwordHash');

    return res.status(200).json(myRooms);
  }catch(err) {
    return res.status(500).json({ message: 'unexpected error found' });
  }
}

// POST /api/rooms/:id/join
// body: { password? } — only needed for private rooms
async function joinRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);

    if(!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if(room.type === 'private') {
      const { password } = req.body;
      if(!password) {
        return res.status(401).json({ error: 'Password is required to join this private room' });
      }

      const passwordMatch = await bcrypt.compare(password, room.passwordHash);
      if(!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    }

    // Check if user is already a member
    if(room.memberIds.some(memberId => memberId.equals(req.user))) {
      return res.status(200).json({ message: 'Already a member of this room' });
    }

    // Add user to memberIds
    room.memberIds.addToSet(req.user);
    await room.save();

    return res.status(200).json({
      _id: room._id,
      name: room.name,
      type: room.type,
      createdBy: room.createdBy,
      memberIds: room.memberIds,
      lastMessageAt: room.lastMessageAt,
    });
  }catch(err) {
    return res.status(500).json({ message: 'unexpected error found' });
  }
}

// POST /api/rooms/:id/leave
async function leaveRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);

    if(!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // if creator is removed
    if(room.createdBy.equals(req.user)) {
      if(room.memberIds.length > 1) {
        // If the creator leaves and there are other members, we can either:
        // 1. Assign a new creator (e.g., the next member in the list)
        // 2. Delete the room entirely
        // Here, we choose to assign a new creator for continuity.
        room.createdBy = room.memberIds.find(memberId => !memberId.equals(req.user));
        room.memberIds.pull(req.user);
        await room.save();
      } else {
        // If the creator is the only member, delete the room
        await Room.findByIdAndDelete(room._id);
      }
    }
    else {
      room.memberIds.pull(req.user);
      await room.save();
    }

    return res.status(200).json({ message: 'Successfully left the room' });
  }catch(err) {
    return res.status(500).json({ message: 'unexpected error found' });
  }
}

module.exports = {
  createRoom,
  listAllRooms,
  listMyRooms,
  joinRoom,
  leaveRoom,
};
