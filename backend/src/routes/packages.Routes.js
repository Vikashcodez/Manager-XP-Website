import express from 'express';
import {
  createPackage, listPackages, updatePackage, setPackageStatus, deletePackage,
  purchasePackage, listCustomerPackages, consumeUnits, cancelCustomerPackage
} from '../controllers/packages.Controller.js';
import { requireStaff, canReadWallet } from '../middleware/authGuards.js';

const packagesRouter = express.Router();
const staff = requireStaff('Café staff access required');

// Customers may read their own packages; canReadWallet enforces ownership.
packagesRouter.get('/customer/:customerId', canReadWallet, listCustomerPackages);

packagesRouter.get('/', staff, listPackages);
packagesRouter.post('/', staff, createPackage);
packagesRouter.put('/:id', staff, updatePackage);
packagesRouter.patch('/:id/status', staff, setPackageStatus);
packagesRouter.delete('/:id', staff, deletePackage);
packagesRouter.post('/:id/purchase', staff, purchasePackage);

packagesRouter.post('/customer-package/:id/consume', staff, consumeUnits);
packagesRouter.post('/customer-package/:id/cancel', staff, cancelCustomerPackage);

export default packagesRouter;
