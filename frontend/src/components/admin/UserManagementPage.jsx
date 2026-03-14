import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch users');
      }

      setUsers(result.data || []);
    } catch (error) {
      setUsersError(error.message || 'Unable to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const normalizedUsers = useMemo(
    () =>
      users.map((item) => {
        let address = item.address;
        if (typeof address === 'string') {
          try {
            address = JSON.parse(address);
          } catch {
            address = null;
          }
        }
        return { ...item, address };
      }),
    [users]
  );

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
        <span className="text-sm text-neutral-400">Total: {normalizedUsers.length}</span>
      </div>

      {loadingUsers && <p className="mt-4 text-neutral-400 text-sm">Loading users...</p>}

      {usersError && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
          {usersError}
        </div>
      )}

      {!loadingUsers && !usersError && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-900/80 text-neutral-300">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">City</th>
              </tr>
            </thead>
            <tbody>
              {normalizedUsers.map((item) => (
                <tr key={item.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3 text-neutral-100">{item.name || '-'}</td>
                  <td className="px-4 py-3 text-neutral-300">{item.email || '-'}</td>
                  <td className="px-4 py-3 text-neutral-300">{item.phone_number || '-'}</td>
                  <td className="px-4 py-3 text-neutral-300 capitalize">{item.role || '-'}</td>
                  <td className="px-4 py-3 text-neutral-300">{item.address?.city || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserManagementPage;