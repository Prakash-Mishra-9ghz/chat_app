import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder landing page for a logged-in user until Phase 2's room
// browser exists.
function Home() {
  const { user, logout } = useAuth();
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Chat App</h1>
      <p>Logged in as: {user?.username ?? user?.email ?? '(fill in once useAuth exposes user)'}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
