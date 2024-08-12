// src/CheckoutPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Fetch cart items from the backend or local storage
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderDetails = {
        cartItems,
        shippingDetails,
        paymentDetails,
      };
      await axios.post('http://localhost:5000/api/orders', orderDetails);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (orderPlaced) {
    return <div>Order placed successfully!</div>;
  }

  return (
    <div>
      <h2>Checkout Page</h2>

      <h3>Cart Items</h3>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>

      <h3>Shipping Details</h3>
      <form>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingDetails.address}
          onChange={handleShippingChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingDetails.city}
          onChange={handleShippingChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={shippingDetails.state}
          onChange={handleShippingChange}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingDetails.postalCode}
          onChange={handleShippingChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingDetails.country}
          onChange={handleShippingChange}
        />
      </form>

      <h3>Payment Details</h3>
      <form>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={paymentDetails.cardNumber}
          onChange={handlePaymentChange}
        />
        <input
          type="text"
          name="expirationDate"
          placeholder="Expiration Date"
          value={paymentDetails.expirationDate}
          onChange={handlePaymentChange}
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={paymentDetails.cvv}
          onChange={handlePaymentChange}
        />
      </form>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;
