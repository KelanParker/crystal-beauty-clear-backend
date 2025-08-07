import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();
dotenv.config();

app.use(cors());

// Serve static files (images) from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(() => {
    console.error('MongoDB connection error');
  });

app.use(bodyParser.json());

//  Public routes (no JWT required)
app.use('/api/users', userRouter);

//  Mixed routes - some public, some protected
import { getProducts, getProductById } from './controllers/productController.js';
import { createProduct, deleteProduct, updateProduct } from './controllers/productController.js';

// Public product routes (no authentication needed)
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);

// Protected product routes (authentication required)
app.post('/api/products', verifyJWT, createProduct);
app.put('/api/products/:id', verifyJWT, updateProduct);
app.delete('/api/products/:id', verifyJWT, deleteProduct);

//  Protected routes (JWT required)
app.use('/api/order', verifyJWT, orderRouter);

app.listen(5000, () => {
    console.log('server started on port 5000');
    console.log('Static files served from: /uploads');
});
