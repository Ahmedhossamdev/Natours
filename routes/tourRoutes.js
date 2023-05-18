const express = require('express');
const tourController = require('./../controllers/tourController');
const catchAsync = require('./../utils/catchAsync');
const router = express.Router();
const {
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController');

const {protect , restrictTo} = require('./../controllers/authController');

router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);





//router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTours,getAllTours);

router.route('/')
.get(protect,getAllTours)
.post(createTour);

router.route('/:id')
.get(getTour)
.delete(protect , restrictTo('admin' , 'lead-guide') , deleteTour)
.patch(updateTour);

module.exports = router;