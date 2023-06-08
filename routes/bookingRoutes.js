const express = require('express');
const router = express.Router();
const {
  getCheckoutSession
}= require('./../controllers/bookingController');

const {
  protect
}= require('./../controllers/authController');
const { getAllBooking , getBooking , deleteBooking ,updateBooking ,creatBooking } = require('../controllers/bookingController');
const { restrictTo } = require('../controllers/authController');

router.use(protect);

router.get('/checkout-session/:tourId' , protect , getCheckoutSession)

router.use(restrictTo('admin' , 'lead-guide'));

router.route('/')
  .get(getAllBooking)
  .post(creatBooking)

router.route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking)

module.exports = router;