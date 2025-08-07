import OrderModel from "../models/order.js";
import ProductModel from "../models/product.js";

export async function createOrder(req, res) {
    if (req.user == null) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const body = req.body;

    // Validate required fields in the request body
    const requiredFields = ['address', 'phone', 'billItems'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!body[field]) {
            return res.status(400).json({ 
                message: `Missing required field: ${field}` 
            });
        }
    }

    // Validate billItems is an array and not empty
    if (!Array.isArray(body.billItems) || body.billItems.length === 0) {
        return res.status(400).json({ 
            message: 'billItems must be a non-empty array' 
        });
    }

    const orderData = {
        orderId: "",
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        address: body.address,
        phone: body.phone,
        status: body.status || "pending", // Default status if not provided
        billItems:[],
        total: 0 // Will be calculated later
    };


    try {
        // Await the database query
        const lastBill = await OrderModel.find().sort({ date: -1 }).limit(1);

        if (!lastBill || lastBill.length === 0 || !lastBill[0].orderId) {
            orderData.orderId = "ORD-0001";
        } else {
            const lastOrder = lastBill[0];
            const lastOrderId = lastOrder.orderId.split("-")[1];  // safe now
            const newOrderId = parseInt(lastOrderId) + 1;
            orderData.orderId = "ORD-" + String(newOrderId).padStart(4, "0");
        }

        // Validate all bill items and check if products exist in database
        let calculatedTotal = 0;
        
        for (let i = 0; i < body.billItems.length; i++) {
            const item = body.billItems[i];
            
            // Check if required fields are present in the request
            if (!item.productID || !item.quantity) {
                return res.status(400).json({ 
                    message: `Missing required fields for item ${i + 1}. ProductID and quantity are required.` 
                });
            }

            // Validate quantity is a positive number
            if (item.quantity <= 0) {
                return res.status(400).json({ 
                    message: `Invalid quantity for item ${i + 1}. Quantity must be positive.` 
                });
            }

            // Check if product exists in database using productID
            const product = await ProductModel.findOne({ productID: item.productID });
            if (!product) {
                return res.status(400).json({ 
                    message: `Product with ID ${item.productID} does not exist in our database.` 
                });
            }

            // Check if product is available
            if (!product.isAvailable) {
                return res.status(400).json({ 
                    message: `Product '${product.name}' is currently not available for purchase.` 
                });
            }

            // Validate if requested quantity is available
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }

            // Use the product's actual price (not from request to prevent price manipulation)
            const itemPrice = product.price;
            const itemTotal = itemPrice * item.quantity;
            calculatedTotal += itemTotal;

            orderData.billItems.push({
                productId: product._id, // Store MongoDB ObjectId
                quantity: item.quantity,
                price: itemPrice,
                productName: product.name,
                productImage: product.imageUrl[0] || "" // First image if available
            });
        }

        // Set the calculated total
        orderData.total = calculatedTotal;


        // Save the order
        const newOrder = new OrderModel(orderData);
        await newOrder.save();
            

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


export async function getOrders(req, res) {
    if (req.user == null) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.user.role == "admin"){
        OrderModel.find()
            .then((orders) => {
                res.status(200).json(orders);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                res.status(500).json({ message: "Internal server error", error: err.message });
            });
    }
    else {
        OrderModel.find({ email: req.user.email })
            .then((orders) => {
                res.status(200).json(orders);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                res.status(500).json({ message: "Internal server error", error: err.message });
            });
    }
}