import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl mb-1">Welcome back</h1>
        <p className="text-ink/60 mb-8">Log in to keep your streaks going.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
            />
          </div>

          {error && <p className="text-clay text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss text-white rounded-md py-2 font-medium hover:bg-moss/90 transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6">
          No account yet? <Link to="/register" className="text-moss font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
