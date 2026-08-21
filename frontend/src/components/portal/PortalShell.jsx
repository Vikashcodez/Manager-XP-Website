import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { portalApi, portalAuth } from '../../lib/portalApi';
import { Banner, Button, Select } from './ui';
import CreateBusiness from './CreateBusiness';

/*
 * The portal shell: navigation, the org and branch switchers, and the trial
 * banner that follows the customer everywhere.
 *
 * Tenancy lives in context rather than being fetched per page. Every page
 * needs to know which branch is selected, and a page that fetched it itself
 * would render one branch's data under another branch's heading for the
 * moment before its own request came back.
 */

const PortalContext = createContext(null);
export const usePortal = () => useContext(PortalContext);

const NAV = [
  { items: [{ to: '/dashboard', label: 'Dashboard', end: true }] },
  {
    label: 'Business',
    items: [
      { to: '/dashboard/organization', label: 'Organization' },
      { to: '/dashboard/branches', label: 'Branches' },
      { to: '/dashboard/users', label: 'Users & Staff' }
    ]
  },
  {
    label: 'CafeXP',
    items: [
      { to: '/dashboard/installations', label: 'Installations' },
      { to: '/dashboard/devices', label: 'Devices / PCs' },
      { to: '/dashboard/downloads', label: 'Downloads' }
    ]
  },
  {
    label: 'Subscription',
    items: [
      { to: '/dashboard/subscription', label: 'My Subscription' },
      { to: '/dashboard/billing', label: 'Billing' }
    ]
  },
  {
    label: 'Support',
    items: [
      { to: '/dashboard/help', label: 'Help Center' },
      { to: '/dashboard/support', label: 'Support' }
    ]
  },
  {
    label: 'Account',
    items: [
      { to: '/dashboard/profile', label: 'Profile' },
      { to: '/dashboard/security', label: 'Security' }
    ]
  }
];

const PortalShell = ({ children }) => {
  const location = useLocation();
  const [me, setMe] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  const [orgId, setOrgId] = useState(portalAuth.organization());
  const [branchId, setBranchId] = useState(portalAuth.branch());

  const load = useCallback(async () => {
    try {
      const data = await portalApi.me();
      setMe(data);

      /* Pick an organization if none is stored, or if the stored one is no
         longer one of theirs — an access change should not leave the portal
         pointing at something they cannot see. */
      const ids = data.organizations.map((o) => String(o.id));
      if (!orgId || !ids.includes(String(orgId))) {
        const first = data.organizations[0];
        if (first) {
          portalAuth.setOrganization(first.id);
          setOrgId(String(first.id));
        }
      }

      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { load(); }, [load]);

  // The trial banner needs the subscription, and it is cheap enough to keep
  // fresh whenever the organization changes.
  useEffect(() => {
    if (!orgId) return;
    portalApi.subscription().then((d) => setSubscription(d)).catch(() => setSubscription(null));
  }, [orgId]);

  const switchOrg = (id) => {
    portalAuth.setOrganization(id);
    portalAuth.setBranch('all');    // a branch from the old org means nothing here
    setOrgId(String(id));
    setBranchId('all');
    window.location.reload();
  };

  const switchBranch = (id) => {
    portalAuth.setBranch(id);
    setBranchId(String(id));
    // Cheaper than a reload and enough: pages read branchId from context.
    window.dispatchEvent(new CustomEvent('cxp:branch-changed', { detail: { branchId: id } }));
  };

  const branchesForOrg = useMemo(
    () => (me?.branches || []).filter((b) => String(b.organization_id) === String(orgId)),
    [me, orgId]
  );

  const value = useMemo(
    () => ({ me, orgId, branchId, subscription, branches: branchesForOrg, reload: load, switchBranch }),
    [me, orgId, branchId, subscription, branchesForOrg, load]
  );

  if (!portalAuth.isSignedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center">
          <p className="text-sm text-neutral-300">{error}</p>
          <Button className="mt-5" onClick={() => { portalAuth.signOut(); window.location.href = '/login'; }}>
            Sign in again
          </Button>
        </div>
      </div>
    );
  }

  /* A signed-in account with no organization is a real case, not an error: an
     account created on the ManagerXP site, or an invitation that was revoked.
     Every page below scopes to an organization and would fail one request at a
     time, so it is answered once, here — and answered with the form rather
     than a link, because the missing business is the only thing standing
     between them and their dashboard. */
  if (me && me.organizations.length === 0) {
    return (
      <CreateBusiness
        name={me.user?.name}
        onDone={() => window.location.reload()}
      />
    );
  }

  const sub = subscription?.subscription;
  const warning = subscription?.warning;

  return (
    <PortalContext.Provider value={value}>
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto flex max-w-[1400px]">

          {/* ── sidebar ── */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto border-r border-neutral-800
                        bg-neutral-950 px-4 py-6 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
                        ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <Link to="/dashboard" className="flex items-center gap-2 px-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-500 text-sm font-black">XP</span>
              <span className="text-lg font-semibold tracking-tight">CafeXP</span>
            </Link>

            {/* Only shown when there is a choice to make. */}
            {me?.organizations.length > 1 && (
              <div className="mt-5 px-1">
                <Select
                  value={orgId}
                  onChange={(e) => switchOrg(e.target.value)}
                  aria-label="Choose business"
                >
                  {me.organizations.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </Select>
              </div>
            )}

            <nav className="mt-6 space-y-6">
              {NAV.map((group, i) => (
                <div key={group.label || i}>
                  {group.label && (
                    <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                      {group.label}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = item.end
                        ? location.pathname === item.to
                        : location.pathname.startsWith(item.to);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setNavOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                            active
                              ? 'bg-red-500/10 text-white ring-1 ring-red-500/25'
                              : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => { portalAuth.signOut(); window.location.href = '/login'; }}
              className="mt-8 w-full rounded-lg border border-neutral-800 px-3 py-2 text-sm font-medium text-neutral-400 transition hover:border-red-500/40 hover:text-white"
            >
              Sign out
            </button>
          </aside>

          {navOpen && (
            <button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
              onClick={() => setNavOpen(false)}
            />
          )}

          {/* ── main ── */}
          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-neutral-800 bg-black/85 px-4 py-3 backdrop-blur sm:px-6">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                className="rounded-lg border border-neutral-800 px-2.5 py-1.5 text-sm text-neutral-300 lg:hidden"
                aria-label="Open navigation"
              >
                ☰
              </button>

              {/* The branch selector. "All branches" only offered when there
                  is more than one — a single-branch café should never have to
                  choose. */}
              {branchesForOrg.length > 0 && (
                <Select
                  value={branchId}
                  onChange={(e) => switchBranch(e.target.value)}
                  aria-label="Choose branch"
                  className="!w-auto"
                >
                  {branchesForOrg.length > 1 && <option value="all">All branches</option>}
                  {branchesForOrg.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
              )}

              <div className="ml-auto flex items-center gap-3">
                {sub && (
                  <span className="hidden text-xs text-neutral-500 sm:inline">
                    {sub.is_trial ? 'Trial' : 'Subscription'} ·{' '}
                    <span className={sub.status === 'ACTIVE' ? 'text-neutral-300' : 'text-red-300'}>
                      {sub.status === 'ACTIVE' ? `${sub.days_remaining} days left` : sub.status.toLowerCase()}
                    </span>
                  </span>
                )}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-800 text-xs font-bold">
                  {(me?.user?.name || '?').slice(0, 1).toUpperCase()}
                </span>
              </div>
            </header>

            <main className="px-4 py-6 sm:px-6 lg:px-8">
              {/* Trial state follows the customer rather than hiding on the
                  subscription page, because the day it expires is the day
                  they need to see it without going looking. */}
              {warning && (
                <div className="mb-6">
                  <Banner
                    tone={warning.level === 'expired' || warning.level === 'critical' ? 'bad'
                      : warning.level === 'warning' ? 'warn' : 'info'}
                    action={
                      <Link to="/dashboard/subscription">
                        <Button size="sm" variant={warning.level === 'expired' ? 'primary' : 'ghost'}>
                          {warning.level === 'expired' ? 'View plans' : 'Manage'}
                        </Button>
                      </Link>
                    }
                  >
                    {warning.message}
                  </Banner>
                </div>
              )}
              {children}
            </main>
          </div>
        </div>
      </div>
    </PortalContext.Provider>
  );
};

export default PortalShell;
