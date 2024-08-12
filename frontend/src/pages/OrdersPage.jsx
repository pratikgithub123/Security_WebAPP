import React, { useEffect, useState } from 'react';
import { deleteOrderApi, getUserOrdersApi } from '../apis/Api'; // Import your API functions
import './components/OrderPage.css'; // Import the CSS file

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            getUserOrdersApi(user._id)
                .then(data => {
                    // Sort orders by creation date, most recent first
                    const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(sortedOrders);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            setError("User not logged in");
            setLoading(false);
        }
    }, [user]);

    const handleDelete = (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            deleteOrderApi(orderId)
                .then(() => {
                    // Remove the deleted order from the state
                    setOrders(orders.filter(order => order._id !== orderId));
                })
                .catch(error => {
                    setError("Failed to delete the order.");
                    console.error('Delete Order Error:', error);
                });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>Your Orders</h1>
            </div>
            {orders.length === 0 ? (
                <p>You have no orders.</p>
            ) : (
                orders.map((order, index) => (
                    <div key={order._id} className="order-item">
                        <h2>Order {index + 1}: {order._id}</h2> {/* Display the order number */}
                        <div className="order-details">
                            <p>Phone Number: {order.phoneNumber}</p>
                            <p>Location: {order.location}</p>
                            <p>Order Date and Time: {new Date(order.createdAt).toLocaleString()}</p> {/* Display the timestamp */}
                        </div>
                        <ul className="order-items-list">
                            {order.items.map(item => (
                                <li key={item.productId._id} className="order-item-details">
                                    <p>Product: {item.productId.productName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                        <p className="order-total-price">Total Price: NPR {order.totalPrice.toFixed(2)}</p>
                        <button onClick={() => handleDelete(order._id)} className="delete-button">
                            Delete Order
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrdersPage;
