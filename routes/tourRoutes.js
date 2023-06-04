const express = require('express');
const tourController = require('./../controllers/tourController');
const catchAsync = require('./../utils/catchAsync');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();


/*
POST /tour/3232/reviews
GET /tour/3232/reviews
GET/tour/12321/reviews
 */

// router
//   .route('/:tourId/reviews')
//   .post(
//     protect,
//     restrictTo('user'),
//     createReview
//   );
//


router.use('/:tourId/reviews' , reviewRouter);





const {
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('./../controllers/tourController');



const {protect , restrictTo} = require('./../controllers/authController');
const { createReview } = require('../controllers/reviewController');



router
  .route('/monthly-plan/:year')
  .get(protect,restrictTo('admin' , 'lead-guide' , 'guide') , getMonthlyPlan);


router
  .route('/tour-stats')
  .get(getTourStats);



//router.param('id', checkID);
router
  .route('/top-5-cheap')
  .get(aliasTopTours,getAllTours);


router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(getDistances)
// /tours-distance?distance=223,center=-40,45&unit=mi
// /tours-distance/223/center/-40,45/unit/mi a lot cleaner


router.route('/')
.get(getAllTours)
.post(protect,restrictTo('admin' , 'lead-guide'),createTour);



router.route('/:id')
.get(getTour)
.delete(protect , restrictTo('admin' , 'lead-guide') , deleteTour)
.patch(protect,restrictTo('admin' , 'lead-guide') , uploadTourImages , resizeTourImages ,updateTour);




module.exports = router;