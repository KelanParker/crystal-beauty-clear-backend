import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';
import dotenv from 'dotenv';


let app = express();

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(() => {
    console.error('MongoDB connection error');
  });



app.use(bodyParser.json());
app.use(verifyJWT);

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/order', orderRouter);

app.listen(5000, () => {
    console.log('server started on port 5000');
});