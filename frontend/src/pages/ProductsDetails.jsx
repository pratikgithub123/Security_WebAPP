// ProductDetails.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './components/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const apiUrl = `http://localhost:5000/api/product/get_product/${id}`;

    axios.get(apiUrl)
      .then(response => {
        if (response.data.success) {
          setProduct(response.data.product || null);
        } else {
          console.error('Error fetching product details:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (product) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const cartItem = {
        userId: user._id,
        productId: product._id,
        quantity: quantity,
      };

      axios.post('http://localhost:5000/api/cart/add', cartItem)
        .then(response => {
          if (response.data.success) {
            toast.success("Item Added Successfully")
            console.log(`Added ${product.productName} to the cart with quantity ${quantity}`);
          } else {
            console.error('Error adding to cart:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
        });
    }
  };

  const calculateTotalPriceWithIncrease = (price, quantity) => {
    const basePrice = price;
    const increaseFactor = 0.1; 
    const totalPrice = basePrice * quantity;
    return totalPrice.toFixed(2);
  };

  return (
    <div className="product-details-container">
      {loading ? (
        <div className="loading-spinner">
          <p>Loading product details...</p>
        </div>
      ) : (
        <>
          {product ? (
            <div className="product-details-content">
              <div className="product-image-wrapper">
                <img
                  src={product.productImageUrl}
                  alt={product.productName}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h1>{product.productName}</h1>
                <p>Care Manual: {product.productDescription}</p>
                
                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  />
                </div>
                <p>Total Price: NPR {calculateTotalPriceWithIncrease(product.productPrice, quantity)}</p>
                <button onClick={addToCart} className="add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          ) : (
            <p>Product not found</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;