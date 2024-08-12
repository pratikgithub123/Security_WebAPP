const router = require('express').Router();
const productController = require('../controllers/productController');
const { authGuard, authGuardAdmin } = require('../middleware/authGuard');

// Create the product
router.post('/create_product', productController.createProduct);

// Get all products
router.get('/get_products', productController.getProducts);

// Get single product
router.get('/get_product/:id', productController.getSingleProduct);

// Update the product
router.put('/update_product/:id', productController.updateProduct);

// Delete the product
router.delete('/delete_product/:id', productController.deleteProduct);

// Search the products
router.get('/search/:products', productController.searchProducts);



module.exports = router;