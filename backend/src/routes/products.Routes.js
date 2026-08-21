import express from 'express';
import {
  listCategories, createCategory, updateCategory, deleteCategory,
  listProducts, customerMenu, createProduct, updateProduct,
  setAvailability, deleteProduct, adjustStock, listMovements, inventorySummary
} from '../controllers/products.Controller.js';
import { requireStaff, requireAuth } from '../middleware/authGuards.js';

const productsRouter = express.Router();
const staff = requireStaff('Café staff access required');

// Any signed-in customer may read the menu — it is what they order from.
productsRouter.get('/menu', requireAuth, customerMenu);

// Literal paths before "/:id".
productsRouter.get('/categories', staff, listCategories);
productsRouter.post('/categories', staff, createCategory);
productsRouter.put('/categories/:id', staff, updateCategory);
productsRouter.delete('/categories/:id', staff, deleteCategory);
productsRouter.get('/inventory/summary', staff, inventorySummary);

productsRouter.get('/', staff, listProducts);
productsRouter.post('/', staff, createProduct);
productsRouter.put('/:id', staff, updateProduct);
productsRouter.patch('/:id/availability', staff, setAvailability);
productsRouter.delete('/:id', staff, deleteProduct);
productsRouter.post('/:id/stock', staff, adjustStock);
productsRouter.get('/:id/movements', staff, listMovements);

export default productsRouter;
