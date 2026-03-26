import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagementPage from '../components/admin/UserManagementPage';
import SubscriptionPlansPage from '../components/admin/SubscriptionPlansPage';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('users');

  return (
    <section className="h-screen overflow-hidden bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden h-[calc(100svh-3rem)]">
          <div className="grid lg:grid-cols-[260px_1fr] h-full">
            <AdminSidebar
              user={user}
              activeMenu={activeMenu}
              onMenuChange={setActiveMenu}
              onLogout={logout}
            />

            <div className="p-4 sm:p-6 lg:p-7 overflow-y-auto min-h-0">
              {activeMenu === 'users' && <UserManagementPage />}
              {activeMenu === 'plans' && <SubscriptionPlansPage />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
