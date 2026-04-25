import React from 'react';

const AdminSidebar = ({ user, activeMenu, onMenuChange, onLogout }) => {
  return (
    <aside className="border-r border-neutral-800 p-4 sm:p-5">
      <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
      <p className="mt-1 text-xs text-neutral-400">{user?.email || 'admin@managerxp.com'}</p>

      <nav className="mt-6 space-y-2">
        <button
          type="button"
          onClick={() => onMenuChange('users')}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'users'
              ? 'bg-red-500/15 text-white border border-red-500/35'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
          }`}
        >
          User Management
        </button>

        <button
          type="button"
          onClick={() => onMenuChange('plans')}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'plans'
              ? 'bg-red-500/15 text-white border border-red-500/35'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
          }`}
        >
          Subscription Plans
        </button>

        <button
          type="button"
          onClick={() => onMenuChange('software')}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'software'
              ? 'bg-red-500/15 text-white border border-red-500/35'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
          }`}
        >
          Software Master
        </button>
        
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 w-full rounded-lg border border-neutral-700 text-neutral-200 text-sm font-medium px-3 py-2.5 hover:bg-neutral-900 hover:text-white transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;