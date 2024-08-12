import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteOrderApi, getAllOrdersApi } from '../../apis/Api';

const AdminDashboardOrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrdersApi();
                if (response.success) {
                    setOrders(response.orders);
                } else {
                    toast.error('Failed to fetch orders.');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to fetch orders.');
            }
        };

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this order?');
        if (!confirm) return;

        try {
            const response = await deleteOrderApi(id);
            if (response.success) {
                setOrders(orders.filter(order => order._id !== id));
                toast.success('Order deleted successfully.');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order.');
        }
    };

    return (
        <div className="m-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Order Management</h1>
            </div>

            <div>
                <h2>All Orders</h2>
                <table className="table table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>User Full Name</th>
                            <th>User Email</th>
                            <th>User Location</th>
                            <th>User Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.status}</td>
                                <td>{order.userId?.fullname}</td>
                                <td>{order.userId?.email}</td>
                                <td>{order.userId?.location}</td>
                                <td>{order.userId?.phonenum}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        type="button"
                                        className="btn btn-danger"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboardOrderPage;
