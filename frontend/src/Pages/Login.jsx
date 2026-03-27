import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(form);
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to login');
    }
  };

  return (
    <section className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md border border-neutral-800 rounded-2xl bg-neutral-950 p-6 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-neutral-400 mt-1">Sign in to your ManagerXP account</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-neutral-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-neutral-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-white text-black font-semibold py-2.5 hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-neutral-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-white underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
