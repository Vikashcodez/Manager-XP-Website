import express from 'express';
import {
  signup, me, dashboard,
  getOrganization, updateOrganization, createOrganization,
  listBranches, createBranch, updateBranch,
  subscription, listDevices, listInstallations, revokeInstallation,
  listUsers, inviteUser, acceptInvite
} from '../controllers/portal.Controller.js';
import { requirePortalUser, withOrganization, withBranch, requireOwner } from '../middleware/tenancy.js';

const router = express.Router();

/* ==========================================================================
   PUBLIC

   Signup creates the account, the business, the branch and the trial in one
   transaction. Accepting an invitation is public for the same reason a
   password reset is: the person has no account to sign in with yet, and the
   single-use token in the request is what authenticates them.
   ========================================================================== */
router.post('/signup', signup);
router.post('/invites/accept', acceptInvite);

/* ==========================================================================
   AUTHENTICATED

   Everything below is scoped by membership. `withOrganization` resolves which
   business this is and refuses any id the user is not a member of;
   `withBranch` does the same for a location, and allows an "all branches"
   view for anyone entitled to more than one.
   ========================================================================== */
router.use(requirePortalUser);

// Spans every organization the user belongs to, so it takes no org scope.
router.get('/me', me);

router.get('/dashboard', withOrganization(), withBranch(), dashboard);

/* No org scope, because the caller has none yet — that is the point of it.
   The handler refuses an account that already belongs to a business. */
router.post('/organizations', createOrganization);

router.get('/organization', withOrganization(), getOrganization);
router.patch('/organization', withOrganization(), requireOwner, updateOrganization);

router.get('/branches', withOrganization(), listBranches);
router.post('/branches', withOrganization(), requireOwner, createBranch);
router.patch('/branches/:branchId', withOrganization(), requireOwner, updateBranch);

router.get('/subscription', withOrganization({ allowSuspended: true }), subscription);

router.get('/devices', withOrganization(), withBranch(), listDevices);
router.get('/installations', withOrganization(), withBranch(), listInstallations);
router.post('/installations/:installationId/revoke', withOrganization(), requireOwner, revokeInstallation);

router.get('/users', withOrganization(), listUsers);
router.post('/users/invite', withOrganization(), requireOwner, inviteUser);

export default router;
