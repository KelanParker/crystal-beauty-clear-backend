import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';
import dotenv from 'dotenv';
import cors from 'cors';

let app = express();

dotenv.config();

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(() => {
    console.error('MongoDB connection error');
  });

app.use(bodyParser.json());

// ✅ Public routes (no JWT required)
app.use('/api/users', userRouter);

// ✅ Protected routes (JWT required)
app.use('/api/products', verifyJWT, productRouter);
app.use('/api/order', verifyJWT, orderRouter);

app.listen(5000, () => {
    console.log('server started on port 5000');
});