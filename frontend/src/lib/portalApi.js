/*
 * Client for the CafeXP customer portal.
 *
 * Two things every call needs and no page should have to remember: the
 * bearer token, and which organization and branch the user is looking at.
 *
 * The scope travels as headers rather than being threaded through every
 * function signature. The server treats both as claims and checks them
 * against membership before answering, so sending them is a convenience for
 * the user — a way of saying "show me Bangalore" — and never a grant of
 * access. Nothing here can widen what the account may see.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TOKEN_KEY = 'cxp_token';
const ORG_KEY = 'cxp_org';
const BRANCH_KEY = 'cxp_branch';

export const portalAuth = {
  token: () => localStorage.getItem(TOKEN_KEY) || '',
  setToken: (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)),

  organization: () => localStorage.getItem(ORG_KEY) || '',
  setOrganization: (id) => (id ? localStorage.setItem(ORG_KEY, String(id)) : localStorage.removeItem(ORG_KEY)),

  /* 'all' is a real value, not an absence — it means "every branch I may
     see", which the dashboard and device list both support. */
  branch: () => localStorage.getItem(BRANCH_KEY) || 'all',
  setBranch: (id) => localStorage.setItem(BRANCH_KEY, id ? String(id) : 'all'),

  signOut: () => {
    [TOKEN_KEY, ORG_KEY, BRANCH_KEY].forEach((k) => localStorage.removeItem(k));
  },
  isSignedIn: () => !!localStorage.getItem(TOKEN_KEY)
};

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (portalAuth.token()) headers.Authorization = `Bearer ${portalAuth.token()}`;
  if (portalAuth.organization()) headers['x-organization-id'] = portalAuth.organization();

  // Only sent when a specific branch is chosen; 'all' means send nothing and
  // let the server scope to everything this user may reach.
  const branch = portalAuth.branch();
  if (branch && branch !== 'all' && !options.noBranch) headers['x-branch-id'] = branch;

  const res = await fetch(`${API_BASE_URL}/api/portal${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = body.data;
    /* A dead token should land the user on the sign-in page rather than
       showing an error they cannot act on. Cleared here so the next render
       redirects instead of retrying forever. */
    if (res.status === 401) portalAuth.signOut();
    throw err;
  }
  return body;
}

export const portalApi = {
  signup: (payload) =>
    request('/signup', { method: 'POST', body: JSON.stringify(payload) }).then((b) => b.data),
  acceptInvite: (token, password) =>
    request('/invites/accept', { method: 'POST', body: JSON.stringify({ token, password }) })
      .then((b) => b.data),

  me: () => request('/me', { noBranch: true }).then((b) => b.data),
  dashboard: () => request('/dashboard').then((b) => b.data),

  /* For an account that has no business yet. Sent without a scope header,
     because there is nothing to scope to — noBranch keeps a stale branch id
     from a previous membership out of the request. */
  createOrganization: (payload) =>
    request('/organizations', { method: 'POST', body: JSON.stringify(payload), noBranch: true })
      .then((b) => b.data),

  organization: () => request('/organization').then((b) => b.data),
  updateOrganization: (payload) =>
    request('/organization', { method: 'PATCH', body: JSON.stringify(payload) }).then((b) => b.data),

  branches: () => request('/branches', { noBranch: true }),
  createBranch: (payload) =>
    request('/branches', { method: 'POST', body: JSON.stringify(payload), noBranch: true }).then((b) => b.data),
  updateBranch: (id, payload) =>
    request(`/branches/${id}`, { method: 'PATCH', body: JSON.stringify(payload), noBranch: true }).then((b) => b.data),

  subscription: () => request('/subscription', { noBranch: true }).then((b) => b.data),

  devices: () => request('/devices'),
  installations: () => request('/installations').then((b) => b.data),
  revokeInstallation: (id, reason) =>
    request(`/installations/${id}/revoke`, { method: 'POST', body: JSON.stringify({ reason }) }),

  users: () => request('/users', { noBranch: true }).then((b) => b.data),
  inviteUser: (payload) =>
    request('/users/invite', { method: 'POST', body: JSON.stringify(payload), noBranch: true }).then((b) => b.data)
};

/* ── formatting, shared so every page agrees ── */

export const money = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 })
    .format(Number(amount || 0));

export const shortDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const relativeTime = (value) => {
  if (!value) return 'never';
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default portalApi;
