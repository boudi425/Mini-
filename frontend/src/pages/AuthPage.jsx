import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const AuthPage = ({ mode }) => {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const data = await request('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        login(data.accessToken, data.user);
        navigate('/users');
      } else {
        await request('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(form)
        });
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="centered">
      <form className="auth-card" onSubmit={submit}>
        <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
        {!isLogin && (
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        {error && <p className="error">{error}</p>}
        <button>{isLogin ? 'Login' : 'Sign up'}</button>
        <p>
          {isLogin ? 'Need account?' : 'Already registered?'}{' '}
          <Link to={isLogin ? '/signup' : '/login'}>{isLogin ? 'Sign up' : 'Login'}</Link>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
