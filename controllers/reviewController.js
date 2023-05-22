const catchAsync = require('./../utils/catchAsync');
const Review  = require('./../models/reviewModel');
const factory = require('./handlerFactory');



exports.getAllReviews = catchAsync (async (req,res , next) => {
  let filter = {};
  // link all reviews with one tour
  if (req.params.tourId) filter = {tour : req.params.tourId};

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
})


exports.createReview = catchAsync ( async (req,res,next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;


  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newReview
  });
})

exports.deleteReview = factory.deleteOne(Review);