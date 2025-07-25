import OrderModel from "../models/order.js";
import ProductModel from "../models/product.js";

export async function createOrder(req, res) {
    if (req.user == null) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const body = req.body;

    const orderData = {
        orderId: "",
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,  // ✅ Fix is here
        address: body.address,
        phone: body.phone,
        status: body.status,
        billItems:[],
        total: body.total
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

        for (let i = 0; i < body.billItems.length; i++) {
            const item = body.billItems[i];
            const product = await ProductModel.findById(item.productId); // Check if product exists

            if (!product) {
            return res.status(400).json({ message: `Product with ID ${item.productId} does not exist.` });
            }

            orderData.billItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            });
        }


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