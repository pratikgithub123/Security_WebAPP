const Cart = require('../model/cartModel');
const Product = require("../model/productModel");
const User = require("../model/userModel");
const Order = require('../model/orderModel');

const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
        return res.status(400).json({
            success: false,
            message: "UserId, Product, and quantity are required"
        });
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart: cart
        });

    } catch (error) {
        console.log(`Error in add to cart is ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getCart = async (req, res) => {
    const userId = req.params.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            console.log(`Cart not found for user ID: ${userId}`);
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart: cart
        });

    } catch (error) {
        console.error("Error in fetching cart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
}

const deleteCartItem = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({
            success: false,
            message: "UserId and ProductId are required"
        });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();

            return res.status(200).json({
                success: true,
                message: "Item removed from cart successfully",
                cart: cart
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

    } catch (error) {
        console.error("Error in deleting cart item:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
}

const clearCart = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "UserId is required"
        });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];  // Clear all items
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "All items removed from cart successfully",
            cart: cart
        });

    } catch (error) {
        console.error("Error in clearing cart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
}

// Add the updateCartItem function
const updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({
            success: false,
            message: "UserId, ProductId, and quantity are required"
        });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();

            return res.status(200).json({
                success: true,
                message: "Cart item updated successfully",
                cart: cart
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

    } catch (error) {
        console.error("Error in updating cart item:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
}

const checkout = async (req, res) => {
    const { userId, phoneNumber, location } = req.body;
  
    if (!userId || !phoneNumber || !location) {
      return res.status(400).json({
        success: false,
        message: "UserId, phoneNumber, and location are required"
      });
    }
  
    try {
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty"
        });
      }
  
      const orderItems = cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));
  
      const order = new Order({
        userId: userId,
        items: orderItems,
        totalPrice: cart.items.reduce((total, item) => {
          const price = item.product?.productPrice || 0;
          const quantity = item.quantity || 0;
          return total + (price * quantity);
        }, 0).toFixed(2),
        phoneNumber: phoneNumber, // Include phoneNumber
        location: location // Include location
      });
  
      await order.save();
  
      cart.items = []; // Clear cart
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Order placed successfully",
        order
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  };



module.exports = {
    addToCart, getCart, deleteCartItem, clearCart, updateCartItem, checkout
}
