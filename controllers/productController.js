import ProductModel from "../models/product.js";

export function createProduct(req, res) {
    if(req.user == null) {
        return res.status(403).json({ message: 'You Need to Log in First' });
    }

    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to create products' });
    }

    const product = new ProductModel(req.body);
    product.save()
        .then(() => {
            res.status(201).json({ message: "Product created successfully", product });
        })
        .catch((error) => {
            console.error("Product creation failed:", error.message);
            res.status(500).json({ message: "Error creating product", error: error.message });
        });
}

export function getProducts(req, res) {
    ProductModel.find()
        .then((products) => {
            res.status(200).json(products);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching products", error });
        });
}

export function getProductById(req, res) {
    console.log("Fetching Product ID:", req.params.id);
    
    ProductModel.findById(req.params.id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(product);
        })
        .catch((error) => {
            console.error("Backend Get Product Error:", error);
            res.status(500).json({ message: "Error fetching product", error: error.message });
        });
}

export function deleteProduct(req, res) {
    console.log("User:", req.user);
    console.log("Deleting Product ID:", req.params.id);

    if(req.user == null) {
        return res.status(403).json({ message: 'You Need to Log in First' });
    }

    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to delete products' });
    }

    // ✅ Fixed: Use MongoDB _id instead of custom productID field
    ProductModel.findByIdAndDelete(req.params.id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ message: "Product deleted successfully", product });
        })
        .catch((error) => {
            console.error("Backend Deletion Error:", error);
            res.status(500).json({ message: "Error deleting product", error: error.message });
        });
}

export function updateProduct(req, res) {
    if(req.user == null) {
        return res.status(403).json({ message: 'You Need to Log in First' });
    }

    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to update products' });
    }

    // ✅ Fixed: Use MongoDB _id instead of custom productID field
    ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ message: "Product updated successfully", product });
        })
        .catch((error) => {
            console.error("Backend Update Error:", error);
            res.status(500).json({ message: "Error updating product", error: error.message });
        });
}