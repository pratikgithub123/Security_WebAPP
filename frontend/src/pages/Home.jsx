import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { getAllProductsApi } from '../apis/Api';
import Banner from './Banner';
import './components/Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});

    useEffect(() => {
        // Fetch all products from the API
        getAllProductsApi().then((res) => {
            setProducts(res.data.products);
        }).catch((err) => {
            console.error('Failed to fetch products:', err);
        });
    }, []);

    const handleAddToCart = (productId) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            updatedCart[productId] = (updatedCart[productId] || 0) + 1;
            return updatedCart;
        });
    };

    // Sort products by date (assuming there's a `createdAt` field)
    const sortedProducts = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get the first 3 products for the recent section
    const recentProducts = sortedProducts.slice(0, 3);

    // Get the next 3 products for the featured section
    const featuredProducts = sortedProducts.slice(3, 6);

    // Get the next 3 products for the top-selling section
    const topSellingProducts = sortedProducts.slice(6, 9);

    // Sort products by price (assuming there's a `productPrice` field)
    const sortedByPrice = products.sort((a, b) => a.productPrice - b.productPrice);

    // Get the first 3 products for the best offers section
    const bestOffers = sortedByPrice.slice(0, 3);

    return (
        <div>
            <Banner />
            <div className="container mt-4">
                {/* Recent Products Section */}
                <h2>Recent Products</h2>
                {recentProducts.length > 0 ? (
                    <div className="row">
                        {recentProducts.map((product) => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <Link to={`/product/${product._id}`} className="text-decoration-none">
                                    <div className="card">
                                        <img 
                                            src={product.productImageUrl} 
                                            className="card-img-top" 
                                            alt={product.productName || 'Product image'} // Add alt text
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.productName}</h5>
                                            <p className="card-text">Price: NPR {product.productPrice}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents the card click event from triggering
                                                    handleAddToCart(product._id);
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recent products found.</p> // Message when no recent products
                )}

                {/* Featured Products Section */}
                <h2>Featured Products</h2>
                {featuredProducts.length > 0 ? (
                    <div className="row">
                        {featuredProducts.map((product) => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <Link to={`/product/${product._id}`} className="text-decoration-none">
                                    <div className="card">
                                        <img 
                                            src={product.productImageUrl} 
                                            className="card-img-top" 
                                            alt={product.productName || 'Product image'} // Add alt text
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.productName}</h5>
                                            <p className="card-text">Price: NPR {product.productPrice}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents the card click event from triggering
                                                    handleAddToCart(product._id);
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No featured products found.</p> // Message when no featured products
                )}

                {/* Top Selling Products Section */}
                <h2>Top Selling Products</h2>
                {topSellingProducts.length > 0 ? (
                    <div className="row">
                        {topSellingProducts.map((product) => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <Link to={`/product/${product._id}`} className="text-decoration-none">
                                    <div className="card">
                                        <img 
                                            src={product.productImageUrl} 
                                            className="card-img-top" 
                                            alt={product.productName || 'Product image'} // Add alt text
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.productName}</h5>
                                            <p className="card-text">Price: NPR {product.productPrice}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents the card click event from triggering
                                                    handleAddToCart(product._id);
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No top-selling products found.</p> // Message when no top-selling products
                )}

                {/* Best Offers Section */}
                <h2>Best Offers</h2>
                {bestOffers.length > 0 ? (
                    <div className="row">
                        {bestOffers.map((product) => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <Link to={`/product/${product._id}`} className="text-decoration-none">
                                    <div className="card">
                                        <img 
                                            src={product.productImageUrl} 
                                            className="card-img-top" 
                                            alt={product.productName || 'Product image'} // Add alt text
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.productName}</h5>
                                            <p className="card-text">Price: NPR {product.productPrice}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents the card click event from triggering
                                                    handleAddToCart(product._id);
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No best offers found.</p> // Message when no best offers
                )}
            </div>
        </div>
    );
};

export default Home;
