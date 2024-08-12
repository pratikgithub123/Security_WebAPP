const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create an order
router.post('/create', orderController.createOrder);

// Route to get orders by user ID

router.get('/user/:userId', orderController.getUserOrders);

// Route to get all orders (for admin)
router.get('/getallorders', orderController.getAllOrders);

// Route to delete an order
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;
