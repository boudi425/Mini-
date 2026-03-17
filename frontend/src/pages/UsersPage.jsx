import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../api/client.js';
import UserCard from '../components/UserCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const UsersPage = () => {
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const data = await request('/api/users', {}, accessToken);
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleFollow = async (target) => {
    const original = [...users];
    setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, is_following: u.is_following ? 0 : 1 } : u)));

    try {
      if (target.is_following) {
        await request(`/api/follow/${target.id}`, { method: 'DELETE' }, accessToken);
      } else {
        await request(`/api/follow/${target.id}`, { method: 'POST' }, accessToken);
      }
    } catch (err) {
      setUsers(original);
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' }, accessToken);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="page">
      <header>
        <h2>Discover users</h2>
        <div>
          <span className="muted">Logged in as {user?.username}</span>
          <button className="secondary" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {users.map((item) => (
          <UserCard
            key={item.id}
            user={item}
            onToggleFollow={toggleFollow}
            onMessage={(id) => navigate(`/chat/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
