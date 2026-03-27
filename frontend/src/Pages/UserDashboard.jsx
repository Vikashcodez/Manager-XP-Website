import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const fetchWithFallback = async (paths) => {
  let lastError;

  for (const path of paths) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`);
      if (!response.ok) {
        lastError = new Error(`Request failed with status ${response.status}`);
        continue;
      }

      const payload = await response.json();
      if (!payload.success) {
        lastError = new Error(payload.message || 'Request failed');
        continue;
      }

      return payload;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to fetch data');
};

const StatCard = ({ label, value, tone }) => (
  <div
    className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${tone}`}
  >
    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">{label}</p>
    <p className="mt-3 text-2xl sm:text-3xl font-semibold text-white">{value}</p>
  </div>
);

const ProfileSection = ({ user, onUpdate, isLoading, error }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || user?.phoneNumber || '',
    addressLine: typeof user?.address === 'string'
      ? user.address
      : user?.address?.street || user?.address?.line1 || '',
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || user?.phoneNumber || '',
      addressLine: typeof user?.address === 'string'
        ? user.address
        : user?.address?.street || user?.address?.line1 || '',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || user?.phoneNumber || '',
      addressLine: typeof user?.address === 'string'
        ? user.address
        : user?.address?.street || user?.address?.line1 || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/90 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 sm:p-7 hover:bg-white/5 transition-colors group"
      >
        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
        <div className="flex items-center space-x-3">
          {!isExpanded && (
            <span className="text-xs text-neutral-400">
              {user?.name || 'Not set'}
            </span>
          )}
          <span className="text-neutral-400 group-hover:text-red-400 transition-colors">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="border-t border-neutral-800 p-6 sm:p-7">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {!isLoading && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-300">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-neutral-300">
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="addressLine" className="mb-2 block text-sm font-medium text-neutral-300">
                    Address
                  </label>
                  <textarea
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed resize-none"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-all duration-300"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl border border-neutral-700 px-6 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const CafeCard = ({ cafe }) => {
  const branchCount = useMemo(
    () => Array.isArray(cafe.branches) ? cafe.branches.filter(Boolean).length : 0,
    [cafe.branches]
  );

  return (
    <article className="group rounded-2xl border border-neutral-800 bg-black/55 p-5 transition-all duration-300 hover:border-red-700/60 hover:shadow-[0_14px_30px_rgba(185,28,28,0.18)] hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-white leading-tight line-clamp-1 flex-1">
          {cafe.name}
        </h3>
        <span
          className={`flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
            cafe.is_active
              ? 'border-red-700/70 bg-red-900/30 text-red-200'
              : 'border-neutral-700 bg-neutral-900 text-neutral-400'
          }`}
        >
          {cafe.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {cafe.description && (
        <p className="mt-2 text-sm text-neutral-300 line-clamp-2">
          {cafe.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
        <span>{branchCount} branch{branchCount !== 1 ? 'es' : ''}</span>
        <span className="font-mono text-neutral-500">ID: {cafe.cafe_id}</span>
      </div>
    </article>
  );
};

const UserDashboard = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileLoading, setProfileLoading] = useState(true);
  const [cafesLoading, setCafesLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [cafesError, setCafesError] = useState('');
  const [cafes, setCafes] = useState([]);
  
  const abortControllerRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError('');

      try {
        const payload = await fetchWithFallback(['/api/auth/users']);
        if (ignore) return;

        const users = Array.isArray(payload.data) ? payload.data : [];
        const matchedUser = users.find((entry) => (
          (user?.id && entry.id === user.id) ||
          (user?.email && entry.email === user.email)
        ));

        if (matchedUser && !ignore) {
          updateUser(matchedUser);
        }
      } catch (error) {
        if (!ignore) {
          setProfileError(error.message || 'Failed to load your profile');
        }
      } finally {
        if (!ignore) {
          setProfileLoading(false);
        }
      }
    };

    if (user?.email) {
      loadProfile();
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const loadCafes = async () => {
      setCafesLoading(true);
      setCafesError('');

      try {
        const payload = await fetchWithFallback(['/api/cafe', '/api/cafes']);
        setCafes(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCafesError(error.message || 'Failed to load cafes');
        }
      } finally {
        setCafesLoading(false);
      }
    };

    loadCafes();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const personalCafeCount = useMemo(
    () => cafes.filter((cafe) => String(cafe.user_id) === String(user?.id)).length,
    [cafes, user?.id]
  );

  const activeCafeCount = useMemo(
    () => cafes.filter((cafe) => cafe.is_active).length,
    [cafes]
  );

  const handleProfileUpdate = useCallback((formData) => {
    updateUser((prev) => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.addressLine,
    }));
  }, [updateUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <section className="relative min-h-screen bg-black text-white">
      {/* Background Effects - Optimized with will-change */}
      <div className="pointer-events-none fixed inset-0 will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(72rem_32rem_at_96%_-6%,rgba(220,38,38,0.24),transparent_60%),radial-gradient(52rem_24rem_at_4%_22%,rgba(127,29,29,0.2),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-7">
          {/* Welcome Section */}
          <div className="overflow-hidden rounded-3xl border border-red-900/40 bg-gradient-to-br from-neutral-950 via-black to-red-950/20">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-red-300">Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}
                </h1>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-neutral-300">
                  Manage your profile and explore the cafe network in ManagerXP
                </p>
              </div>

              <div className="rounded-2xl border border-red-800/40 bg-black/60 p-5">
                <p className="text-sm text-neutral-300">Quick Stats</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <StatCard
                    label="Total Cafes"
                    value={cafesLoading ? '...' : cafes.length}
                    tone="border-neutral-800 bg-neutral-950/80"
                  />
                  <StatCard
                    label="Active Cafes"
                    value={cafesLoading ? '...' : activeCafeCount}
                    tone="border-red-900/70 bg-red-950/40"
                  />
                  <StatCard
                    label="My Cafes"
                    value={cafesLoading ? '...' : personalCafeCount}
                    tone="border-neutral-800 bg-neutral-950/80 col-span-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1fr_1.4fr]">
            {/* Profile Section - Accordion Style */}
            <ProfileSection
              user={user}
              onUpdate={handleProfileUpdate}
              isLoading={profileLoading}
              error={profileError}
            />

            {/* Cafes Section */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950/90 overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-neutral-800">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-white">Cafe Network</h2>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-red-800/60 bg-red-950/30 px-3 py-1 text-xs uppercase tracking-wider text-red-200">
                      {cafes.length} listed
                    </span>
                    <button
                      onClick={() => navigate('/add-cafe')}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-all duration-300 whitespace-nowrap"
                    >
                      Add Cafe
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                {cafesLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                  </div>
                )}

                {cafesError && (
                  <div className="rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3">
                    <p className="text-sm text-red-200">{cafesError}</p>
                  </div>
                )}

                {!cafesLoading && !cafesError && (
                  <>
                    {cafes.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-neutral-400">No cafes found</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {cafes.map((cafe) => (
                          <CafeCard key={cafe.cafe_id} cafe={cafe} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;