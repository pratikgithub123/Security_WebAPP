
//import router from express
const router = require('express').Router();
const userController = require('../controllers/userController.js');
//routes for the user
router.post('/create',userController.createUser)

router.post('/login' ,userController.loginUser)

router.get('/get_users',  userController.getUsers); 


router.delete('/delete_user/:id',  userController.deleteUser);
router.post('/guest_login', userController.guestLogin);
router.post('/change-password', userController.changePassword);
router.get('/profile/:userId', userController.getUserProfile);




module.exports = router;  

