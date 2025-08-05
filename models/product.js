import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true
    },

    category: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    altNames : { 
        type: [String], 
        default: [] 
    },
    brand: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    labeledPrice: { 
        type: Number, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    stock : { 
        type: Number, 
        required: true 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    description: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: [String], 
        required: true,
        default: [] 
    }
});

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
