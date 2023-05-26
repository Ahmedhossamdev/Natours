const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTour,
  getLoginForm
} = require('../controllers/viewController');
const {
  protect,
  isLoggedIn
} = require('../controllers/authController')


router.use(isLoggedIn);

router.get('/' , getOverview);
router.get('/tour/:tourSlug', getTour)


router.get('/login' , getLoginForm);



module.exports = router;