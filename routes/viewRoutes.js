const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
} = require('../controllers/viewController');
const {
  protect,
  isLoggedIn
} = require('../controllers/authController')




router.get('/' , isLoggedIn ,getOverview);
router.get('/tour/:tourSlug' , isLoggedIn ,getTour);
router.get('/login' , isLoggedIn ,getLoginForm);
router.get('/me', protect ,getAccount)

router.post('/submit-user-data' ,protect , updateUserData )


module.exports = router;