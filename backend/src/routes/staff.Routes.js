import express from 'express';
import {
  staffLogin, whoAmI, listStaff, createStaff, updateStaff, setStaffStatus,
  listRoles, listPermissions, createRole, setRolePermissions, deleteRole,
  createPermission, deletePermission
} from '../controllers/staff.Controller.js';
import { requireStaff, requireAuth, requirePermission } from '../middleware/authGuards.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const staffRouter = express.Router();

// Public: staff sign in here.
staffRouter.post('/login', loginLimiter, staffLogin);

// Any authenticated principal can ask what it is allowed to do — the admin UI
// uses this to hide what the signed-in person cannot use.
staffRouter.get('/me', requireAuth, whoAmI);

// Reading the catalogue needs only staff access; changing it needs the right.
staffRouter.get('/permissions', requireStaff(), listPermissions);
staffRouter.post('/permissions', requirePermission('staff.manage'), createPermission);
staffRouter.delete('/permissions/:key', requirePermission('staff.manage'), deletePermission);
staffRouter.get('/roles', requirePermission('staff.view'), listRoles);
staffRouter.post('/roles', requirePermission('staff.manage'), createRole);
staffRouter.put('/roles/:id/permissions', requirePermission('staff.manage'), setRolePermissions);
staffRouter.delete('/roles/:id', requirePermission('staff.manage'), deleteRole);

staffRouter.get('/', requirePermission('staff.view'), listStaff);
staffRouter.post('/', requirePermission('staff.manage'), createStaff);
staffRouter.put('/:id', requirePermission('staff.manage'), updateStaff);
staffRouter.patch('/:id/status', requirePermission('staff.manage'), setStaffStatus);

export default staffRouter;
