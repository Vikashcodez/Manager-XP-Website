import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-[calc(100svh-4rem)] bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-neutral-400">Welcome, {user?.email || 'Admin'}.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-sm text-neutral-400">Role</p>
            <p className="mt-2 text-xl font-semibold">{user?.role || 'admin'}</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-sm text-neutral-400">System Status</p>
            <p className="mt-2 text-xl font-semibold text-emerald-400">Active</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-sm text-neutral-400">Access Level</p>
            <p className="mt-2 text-xl font-semibold">Full Control</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
