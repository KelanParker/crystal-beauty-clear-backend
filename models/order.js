import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    billItems: {
        type: [{
            productId: String,
            quantity: Number,
            price: Number,
            productName: String,
            productImage: String,
            
        }],
        required: true
    },
    total : {
        type: Number,
        required: true
    }
});
const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;