import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addtoCartsApi } from '../apis/Api';

const Card = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const user = JSON.parse(localStorage.getItem("user")); 
  const userId = user?._id;
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!userId) {
      toast.warn('Please log in to add items to the cart');
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }

    const formData = {
      userId,
      productId: product._id,
      quantity
    };

    try {
      const response = await addtoCartsApi(formData);
      if (response.data.success) {
        toast.success('Item Added Successfully');
        console.log(`Added ${product.productName} to the cart ${quantity} piece`);
      } else {
        toast.error('Error adding item to cart');
        console.error('Error adding to cart:', response.data.message);
      }
    } catch (error) {
      toast.error('Error adding item to cart');
      console.error('Error adding to cart:', error.message);
    }
  };

  const totalPrice = (product.productPrice * quantity).toFixed(2);

  return (
    <li className="product-item">
      <div className="product-details">
        <Link to={`/product/${product._id}`}>
          <img className="product-images" src={product.productImageUrl} alt={product.productName} />
        </Link>
        <div className="product-info">
          <h3>{product.productName}</h3>
          <label>
            Category: <h7>{product.productCategory}</h7>
          </label>
          
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            />
            <label>Piece</label>
          </div>
          <p>Total Price: NPR {totalPrice}</p>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </li>
  );
};

export default Card;
