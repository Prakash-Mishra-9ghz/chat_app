import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {

      await register(username, email, password);
      navigate('/');
      
    }catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '4rem auto' }}>
      <h1>Register</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
