import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      
      const updatedCart = [...state, action.payload];
      return updatedCart;

    case 'REMOVE_FROM_CART':
     
      const productIdToRemove = action.payload;
      const filteredCart = state.filter(item => item.productId !== productIdToRemove);
      return filteredCart;

    case 'GET_CART':
      
      return state;

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const getCart = () => {
    dispatch({ type: 'GET_CART' });
  };

  return (
    <CartContext.Provider value={{ cartState, addToCart, removeFromCart, getCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  return useContext(CartContext);
};

export { CartProvider, useCart };

