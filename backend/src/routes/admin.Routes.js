/*
 * ManagerXP admin API.
 *
 * Mounted at /api/admin. Everything below the auth block requires a
 * ManagerXP administrator token — never a café owner's, whatever role value
 * it happens to carry — and every write additionally requires the permission
 * named on its line.
 *
 * Section 40: "Do not rely only on frontend route visibility." The sidebar
 * decides what is offered; these guards decide what is possible.
 */
import express from 'express';
import {
  login, me, logout, forgotPassword, resetPassword, changePassword
} from '../controllers/adminAuth.Controller.js';
import {
  dashboard,
  listOrganizations, getOrganization, getOrganizationEntitlements,
  setOverride, setOrganizationStatus,
  listPackages, getPackage, createPackage, updatePackage,
  setPackageFeatures, setPackagePrices,
  listFeatureMaster, createFeature, updateFeature,
  listAddons, createAddon,
  listAudit
} from '../controllers/admin.Controller.js';
import {
  listBranches, getPcPool, updateBranch,
  listSubscriptions, getSubscriptionDetail, updateSubscription,
  extendSubscription, setSubscriptionStatus,
  addSubscriptionAddon, removeSubscriptionAddon
} from '../controllers/adminBranches.Controller.js';
import { requireAdmin, requirePermission } from '../middleware/adminAuth.js';

const router = express.Router();

/* ==========================================================================
   PUBLIC — the door itself

   These four are the only unauthenticated routes. Rate limiting and lockout
   live inside the controller, on the database row, so restarting the process
   does not reset an attacker's allowance.
   ========================================================================== */
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

/* ========================================================================== */
router.use(requireAdmin);

router.get('/auth/me', me);
router.post('/auth/logout', logout);
router.post('/auth/change-password', changePassword);

router.get('/dashboard', dashboard);

/* Customers. Suspending one stops a café trading, so it sits behind its own
   permission rather than riding on organizations.edit. */
router.get('/organizations', requirePermission('organizations.view'), listOrganizations);
router.get('/organizations/:id', requirePermission('organizations.view'), getOrganization);
router.get('/organizations/:id/entitlements', requirePermission('organizations.view'), getOrganizationEntitlements);
router.put('/organizations/:id/overrides/:featureKey', requirePermission('subscriptions.edit'), setOverride);
router.post('/organizations/:id/status', requirePermission('organizations.suspend'), setOrganizationStatus);

/* Branches, across every customer. The PC pool sits under the organization
   because that is what owns the capacity — a branch only draws on it. */
router.get('/branches', requirePermission('branches.view'), listBranches);
router.patch('/branches/:id', requirePermission('branches.edit'), updateBranch);
router.get('/organizations/:id/pool', requirePermission('branches.view'), getPcPool);

/* Subscriptions. Extending and changing status are separate from the general
   editor because they are the two an operator reaches for under pressure, and
   because cancelling is not something to reach by accident inside a form. */
router.get('/subscriptions', requirePermission('subscriptions.view'), listSubscriptions);
router.get('/subscriptions/:id', requirePermission('subscriptions.view'), getSubscriptionDetail);
router.patch('/subscriptions/:id', requirePermission('subscriptions.edit'), updateSubscription);
router.post('/subscriptions/:id/extend', requirePermission('subscriptions.edit'), extendSubscription);
router.post('/subscriptions/:id/status', requirePermission('subscriptions.cancel', 'subscriptions.edit'), setSubscriptionStatus);
router.post('/subscriptions/:id/addons', requirePermission('subscriptions.edit'), addSubscriptionAddon);
router.delete('/subscriptions/:id/addons/:rowId', requirePermission('subscriptions.edit'), removeSubscriptionAddon);

/* Package Master. */
router.get('/packages', requirePermission('packages.view'), listPackages);
router.get('/packages/:id', requirePermission('packages.view'), getPackage);
router.post('/packages', requirePermission('packages.create'), createPackage);
router.patch('/packages/:id', requirePermission('packages.edit'), updatePackage);
router.put('/packages/:id/features', requirePermission('packages.edit'), setPackageFeatures);
router.put('/packages/:id/prices', requirePermission('packages.edit'), setPackagePrices);

/* Feature Master. */
router.get('/features', requirePermission('features.view'), listFeatureMaster);
router.post('/features', requirePermission('features.create'), createFeature);
router.patch('/features/:key', requirePermission('features.edit'), updateFeature);

/* Add-ons. */
router.get('/addons', requirePermission('addons.view'), listAddons);
router.post('/addons', requirePermission('addons.edit'), createAddon);

router.get('/audit', requirePermission('audit.view'), listAudit);

export default router;
