// Product.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import './components/Card.css';
import './components/Product.css';

const Product = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [orderDropdown, setOrderDropdown] = useState('asc');
  const [nameOrderDropdown, setNameOrderDropdown] = useState('asc');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const apiUrl = searchQuery
      ? `http://localhost:5000/api/product/search_products?query=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`
      : `http://localhost:5000/api/product/get_products?page=${currentPage}&limit=${itemsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    axios.get(apiUrl)
      .then(response => {
        if (response.data.success) {
          setProducts(response.data.products || []);
        } else {
          console.error('Error fetching products:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, itemsPerPage, searchQuery, sortBy, sortOrder, searchInput]);

  const handleSortChange = (e) => {
    if (e.target.value === 'price') {
      setSortOrder(orderDropdown);
    } else {
      setSortOrder('asc');
    }

    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrderDropdown(e.target.value);
    setSortOrder(e.target.value);
  };

  const handleNameOrderChange = (e) => {
    setNameOrderDropdown(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filterProducts = () => {
   
    const filteredProducts = products.filter(product =>
      product.productName.toLowerCase().includes(searchInput.toLowerCase())
    );

    setProducts(() => {
      return filteredProducts
    });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculatePriceWithQuantity = (price, quantity) => {
    const basePrice = price;
    
    const totalPrice = basePrice * (quantity);
    return totalPrice.toFixed(2);
  };

  const sortedProducts = () => {
    if (sortBy === 'name') {
      return [...products].sort((a, b) => {
        const order = nameOrderDropdown === 'asc' ? 1 : -1;
        return order * a.productName.localeCompare(b.productName);
      });
    } else if (sortBy === 'price') {
      return [...products].sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        return order * (a.productPrice - b.productPrice);
      });
    } else {
      return products;
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedProducts().length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts().slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="product-container">
      <h1 className="product-heading">Discover the fresh Plants!</h1>

      <div className="search-container">
        <label>Search Product:</label>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Enter product name..."
        />
        <button onClick={filterProducts}>Search</button>
      </div>

      <div className="sort-container">
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="">Default Sorting</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        {sortBy === 'price' && (
          <select value={orderDropdown} onChange={handleOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        )}

        {sortBy === 'name' && (
          <select value={nameOrderDropdown} onChange={handleNameOrderChange}>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        )}
      </div>

      <ul className="product-list">
        {currentProducts.map(product => (
          <Card
            key={product._id}
            product={product}
            calculatePriceWithQuantity={calculatePriceWithQuantity}
          />
        ))}
      </ul>

      <div className="pagination">
        {pageNumbers.map(number => (
          <span key={number} onClick={() => paginate(number)} className={number === currentPage ? 'active' : ''}>
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Product;
