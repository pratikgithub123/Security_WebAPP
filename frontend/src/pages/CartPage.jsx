import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearCartApi, createOrderApi, deleteCartApi, getAllCartsApi, updateCartApi } from '../apis/Api';


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getAllCartsApi(id);
        if (response.data.success) {
          setCartItems(response.data.cart.items || []);
        } else {
          console.error('Error fetching cart:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [id]);

  const handleDeleteCartApi = async (productId) => {
    try {
      const formData = { userId: id, productId };
      const response = await deleteCartApi(formData);
      if (response.data.success) {
        setCartItems(cartItems.filter(item => item.product?._id !== productId));
        toast.success("Item Deleted From Cart");
      } else {
        console.error('Error deleting cart item:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const confirmAndDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      handleDeleteCartApi(productId);
    }
  };

  const handleClearCartApi = async () => {
    if (window.confirm("Are you sure you want to clear the entire cart?")) {
      try {
        const response = await clearCartApi(id);
        if (response.data.success) {
          setCartItems([]);
          toast.success("All items removed from cart");
        } else {
          console.error('Error clearing cart:', response.data.message);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent updating to invalid quantity

    setUpdating(true);
    try {
      const formData = { userId: id, productId, quantity: newQuantity };
      const response = await updateCartApi(formData);
      if (response.data.success) {
        setCartItems(cartItems.map(item =>
          item.product?._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
        toast.success("Cart updated successfully");
      } else {
        console.error('Error updating cart:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!phoneNumber || !location) {
      toast.error("Phone number and location are required");
      return;
    }

    if (window.confirm("Are you sure you want to proceed to create an order?")) {
      try {
        const response = await createOrderApi(id, phoneNumber, location);
        if (response.success) {
          setCartItems([]);
          setPhoneNumber('');
          setLocation('');
          toast.success("Order created successfully!");
        } else {
          toast.error("Error creating order: " + response.message);
        }
      } catch (error) {
        console.error('Error creating order:', error);
        toast.error("Error creating order. Please try again.");
      }
    }
  };

  const handlePhoneNumberChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleLocationChange = (e) => {
    // Convert input to uppercase
    setLocation(e.target.value.toUpperCase());
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.product?.productPrice || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0).toFixed(2);

  return (
    <div className="m-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <button onClick={handleClearCartApi} className="btn btn-danger">Clear Cart</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length > 0 ? (
        <>
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product?._id}>
                  <td>
                    <img src={item.product?.productImageUrl} alt={item.product?.productName} className="product-image" style={{ width: '100px', height: 'auto' }} />
                  </td>
                  <td>{item.product?.productName || 'Unknown'}</td>
                  <td>NPR {item.product?.productPrice?.toFixed(2) || '0.00'}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) => handleUpdateQuantity(item.product?._id, Number(e.target.value))}
                      disabled={updating}
                    />
                  </td>
                  <td>
                    <button onClick={() => confirmAndDelete(item.product?._id)} type="button" className="btn btn-danger">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3"></td>
                <td className="font-bold">Total:</td>
                <td className="font-bold">NPR : {totalPrice}</td>
              </tr>
            </tbody>
          </table>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={handleLocationChange}
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-end">
            <button onClick={handleCreateOrder} className="btn btn-primary mt-4">Proceed to Create Order</button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p>No items in the cart.</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
