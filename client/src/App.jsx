import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Rooms from './pages/Rooms';

function App() {
  const { logout } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>
              <div style={{ textAlign: 'right', padding: '16px 24px 0' }}>
              <button className="btn-ghost" onClick={logout}>Log out</button>
            </div>
              <Rooms />
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
