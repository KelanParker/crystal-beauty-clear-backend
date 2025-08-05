import express from 'express';
import { createProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import { getProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getProducts);
productRouter.delete('/products/:id', deleteProduct);
productRouter.put('/products/:id', updateProduct);


export default productRouter;