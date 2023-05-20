const catchAsync = require('./../utils/catchAsync');
const Review  = require('./../models/reviewModel');

exports.getAllReviews = catchAsync (async (req,res , next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
})


exports.createReview = catchAsync ( async (req,res,next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newReview
  });
})