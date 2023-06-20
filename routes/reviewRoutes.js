const express = require('express');
const router = express.Router({mergeParams: true});

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,

} = require('../controllers/reviewController');
const { protect ,restrictTo } = require('../controllers/authController');
const { isBooked } = require('../controllers/bookingController');


//GET /tour/3213213/reviews

router.use(protect)
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'),setTourUserIds, isBooked ,createReview);



router.
route('/:id')
  .get(getReview)
  .patch(restrictTo('user' , 'admin') , updateReview)
  .delete(restrictTo('admin' , 'user') , deleteReview);



module.exports = router;