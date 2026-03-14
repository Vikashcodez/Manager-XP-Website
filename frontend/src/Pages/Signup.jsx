import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialState = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  address: {
    street: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pinCode: '',
  },
};

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register(form);
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to signup');
    }
  };

  return (
    <section className="min-h-[calc(100svh-4rem)] bg-black text-white px-4 py-10">
      <div className="w-full max-w-2xl mx-auto border border-neutral-800 rounded-2xl bg-neutral-950 p-6 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-neutral-400 mt-1">Register with details required by backend validation</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-neutral-300 mb-1.5">Name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm text-neutral-300 mb-1.5">Phone Number</label>
              <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm text-neutral-300 mb-1.5">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm text-neutral-300 mb-1.5">Street</label>
              <input id="street" name="street" value={form.address.street} onChange={onAddressChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="landmark" className="block text-sm text-neutral-300 mb-1.5">Landmark (optional)</label>
              <input id="landmark" name="landmark" value={form.address.landmark} onChange={onAddressChange} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm text-neutral-300 mb-1.5">City</label>
              <input id="city" name="city" value={form.address.city} onChange={onAddressChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="district" className="block text-sm text-neutral-300 mb-1.5">District</label>
              <input id="district" name="district" value={form.address.district} onChange={onAddressChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm text-neutral-300 mb-1.5">State</label>
              <input id="state" name="state" value={form.address.state} onChange={onAddressChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm text-neutral-300 mb-1.5">Country</label>
              <input id="country" name="country" value={form.address.country} onChange={onAddressChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label htmlFor="pinCode" className="block text-sm text-neutral-300 mb-1.5">Pin Code</label>
              <input id="pinCode" name="pinCode" value={form.address.pinCode} onChange={onAddressChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm text-neutral-300 mb-1.5">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={onChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-neutral-300 mb-1.5">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} required className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-600" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-white text-black font-semibold py-2.5 hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white underline underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
