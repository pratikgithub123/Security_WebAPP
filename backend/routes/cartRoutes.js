const router = require('express').Router();
const cartController = require('../controllers/cartController');

router.post("/add", cartController.addToCart )
router.get("/getcart/:userId", cartController.getCart )
router.delete("/delete", cartController.deleteCartItem )
router.post("/clear",cartController.clearCart); 
router.put("/update", cartController.updateCartItem);
router.post("/checkout", cartController.checkout);


module.exports = router;