// const catchAsync = require('./../utils/catchAsync');
const Review  = require('./../models/reviewModel');
const factory = require('./handlerFactory');






// simple middleware
exports.setTourUserIds = (req,res,next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview     = factory.getOne(Review)
exports.createReview  = factory.createOne(Review);
exports.updateReview  = factory.updateOne(Review);
exports.deleteReview  = factory.deleteOne(Review);