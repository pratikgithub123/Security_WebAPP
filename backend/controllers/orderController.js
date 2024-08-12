const Order = require('../model/orderModel');
const Cart = require('../model/cartModel');

const createOrder = async (req, res) => {
    const { userId, phoneNumber, location } = req.body;

    if (!userId || !phoneNumber || !location) {
        return res.status(400).json({
            success: false,
            message: "UserId, phoneNumber, and location are required"
        });
    }

    try {
        // Fetch the user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        console.log("Fetched cart:", cart); // Debugging

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty or not found"
            });
        }

        // Create order items from cart items
        const orderItems = cart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        }));

        // Calculate total price
        const totalPrice = cart.items.reduce((total, item) => {
            const price = item.product.productPrice || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0).toFixed(2);

        // Create new order
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice,
            phoneNumber, // Add phoneNumber
            location // Add location
        });

        await order.save();

        // Clear the cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const getUserOrders = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch the user's orders and populate product details
        const orders = await Order.find({ userId }).populate({
            path: 'items.productId', // Ensure this matches your schema
            select: 'productName productPrice' // Adjust fields as needed
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user"
            });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


        
  

const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders and populate both product and user details
        const orders = await Order.find()
            .populate({
                path: 'items.productId', 
                select: 'productName productPrice' 
            })
            .populate({
                path: 'userId', 
                select: 'fullname email location phonenum' 
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    getAllOrders
};



const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    deleteOrder
};
