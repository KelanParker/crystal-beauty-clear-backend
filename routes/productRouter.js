import express from 'express';
import { createProduct, deleteProduct, getProductById, updateProduct } from '../controllers/productController.js';
import { getProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById)
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);

export default productRouter;
