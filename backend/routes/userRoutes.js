
//import router from express
const router = require('express').Router();
const userController = require('../controllers/userController.js');
const authGuard = require('../middleware/authGuard.js');
//routes for the user
router.post('/create',userController.createUser)

router.post('/login' ,userController.loginUser)

router.get('/get_users',  userController.getUsers); 


router.delete('/delete_user/:id', authGuard, userController.deleteUser);
router.post('/guest_login', userController.guestLogin);
router.post('/change-password', authguard,userController.changePassword);
router.get('/profile/:userId',authguard, userController.getUserProfile);
router.put('/update_profile/:userId', authguard,userController.updateUserProfile);




module.exports = router;  

