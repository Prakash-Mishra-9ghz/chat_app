import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Rooms() {
  const [myRooms, setMyRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [error, setError] = useState('');

  // create-room form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('public');
  const [newRoomPassword, setNewRoomPassword] = useState('');

  // join-private-room state — which room (if any) is currently asking
  // for a password before joining
  const [joiningRoomId, setJoiningRoomId] = useState(null);
  const [joinPassword, setJoinPassword] = useState('');

  useEffect(() => {
    const fetchMyRooms = async () => {
      const response = await api.get('/rooms/mine');
      setMyRooms(response.data);
    };

    const fetchAllRooms = async () => {
      const response = await api.get('/rooms');
      setAllRooms(response.data);
    };

    const loadRooms = async () => {
      try {
        await fetchMyRooms();
        await fetchAllRooms();
      }catch (err) {
        setError('Failed to fetch rooms. Please try again later.');
      }
    }

    loadRooms();
  }, []);

  async function handleCreateRoom(e) {
    e.preventDefault();
        const roomData = {
      name: newRoomName,
      type: newRoomType,
      password: newRoomType === 'private' ? newRoomPassword : undefined,
    };

    try {
      const response = await api.post('/rooms', roomData);
      // On success, refetch both lists to include the new room
      const myRoomsResponse = await api.get('/rooms/mine');
      setMyRooms(myRoomsResponse.data);
      const roomsResponse = await api.get('/rooms');
      setAllRooms(roomsResponse.data);
      // Clear the form fields
      setNewRoomName('');
      setNewRoomType('public');
      setNewRoomPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room. Please try again.');
    }
  }

  async function handleJoinClick(room) {
    if(room.type === 'public') {
      try {
        await api.post(`/rooms/${room._id}/join`);
        // On success, refetch both lists to include the joined room
        const myRoomsResponse = await api.get('/rooms/mine');
        setMyRooms(myRoomsResponse.data);
        const roomsResponse = await api.get('/rooms');
        setAllRooms(roomsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to join room. Please try again.');
      }
    }
    //the password prompt below renders
    else if(room.type === 'private') {
      setJoiningRoomId(room._id);
    }
  }

  async function handleJoinSubmit(e) {
    e.preventDefault();

    try {
      await api.post(`/rooms/${joiningRoomId}/join`, { password: joinPassword });
      // On success, refetch both lists to include the joined room
      const myRoomsResponse = await api.get('/rooms/mine');
      setMyRooms(myRoomsResponse.data);
      const roomsResponse = await api.get('/rooms');
      setAllRooms(roomsResponse.data);
      // Clear the join state
      setJoiningRoomId(null);
      setJoinPassword('');
    }
    catch (err) {
      setError(err.response?.data?.error || 'Failed to join room. Please try again.');
    }
  }

  async function handleLeaveRoom(roomId) { 
    try {
      await api.post(`/rooms/${roomId}/leave`); 
      // On success, refetch both lists to reflect the change 
      const myRoomsResponse = await api.get('/rooms/mine'); 
      setMyRooms(myRoomsResponse.data); 
      const roomsResponse = await api.get('/rooms'); 
      setAllRooms(roomsResponse.data); 
    } catch (err) { 
      setError(err.response?.data?.error || 'Failed to leave room. Please try again.'); 
    } 
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Rooms</h1>
      </div>
      {error && <p className="error-banner">{error}</p>}

      <section className="panel">
        <h2>Create a room</h2>
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <input
            type="text"
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            required
          />
          <select value={newRoomType} onChange={(e) => setNewRoomType(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {newRoomType === 'private' && (
            <input
              type="password"
              placeholder="Room password"
              value={newRoomPassword}
              onChange={(e) => setNewRoomPassword(e.target.value)}
              required
            />
          )}
          <button type="submit" className="btn-primary">Create</button>
        </form>
      </section>

      <section>
        <h2>My rooms</h2>
        {myRooms.length === 0 ? (
          <p className="empty-state">You haven't joined any rooms yet.</p>
        ) : (
          <ul className="room-list">
            {myRooms.map((room) => (
              <li key={room._id} className="room-row">
                <span className="room-name">
                  <span className="status-dot" />
                  {room.name}
                </span>
                <span className="room-meta">{room.type}
                  <button type="button" className="btn-ghost" 
                  onClick={() => handleLeaveRoom(room._id)} > 
                  Leave
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Browse rooms</h2>
        {allRooms.length === 0 ? (
          <p className="empty-state">No rooms yet — create the first one above.</p>
        ) : (
          <ul className="room-list">
            {allRooms.map((room) => (
              <li key={room._id} className="room-row">
                <span className="room-name">
                  {room.name}
                  {room.type === 'private' && <span className="badge-lock">🔒</span>}
                </span>
                <button type="button" className="btn-ghost" onClick={() => handleJoinClick(room)}>
                  Join
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {joiningRoomId && (
        <form onSubmit={handleJoinSubmit} className="panel join-prompt">
          <p>This room is private — enter the password to join.</p>
          <input
            type="password"
            value={joinPassword}
            onChange={(e) => setJoinPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Join</button>
          <button type="button" className="btn-ghost" onClick={() => setJoiningRoomId(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
