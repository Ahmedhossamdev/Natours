const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTours,
  getSignUp,
  getResetPassword,
  getForgotPassword,
} = require('../controllers/viewController');
const {
  protect,
  isLoggedIn, resetPassword
} = require('../controllers/authController')

const {
 creatBookingCheckout
} = require('../controllers/bookingController')


router.get('/' , isLoggedIn , creatBookingCheckout , getOverview);
router.get('/tour/:tourSlug' , isLoggedIn ,getTour);
router.get('/signup' , isLoggedIn ,getSignUp);
router.get('/login' , isLoggedIn ,getLoginForm);
router.get('/forgotPassword',isLoggedIn,getForgotPassword);
router.get('/resetPassword/:token' , getResetPassword);
router.get('/me', protect ,getAccount)
router.get('/my-tours', protect , getMyTours);

router.post('/submit-user-data' ,protect , updateUserData )


module.exports = router;