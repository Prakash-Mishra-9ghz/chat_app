import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage (in App.jsx, once wired):
// <Route path="/rooms" element={<ProtectedRoute><RoomBrowser /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  // TODO: pull whatever you exposed from useAuth() that tells you if
  // someone's logged in.
  // If not logged in: return <Navigate to="/login" /> instead of
  // rendering children.
  // If logged in: render children as-is.
  const { isAuthenticated } = useAuth();

  if(!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
