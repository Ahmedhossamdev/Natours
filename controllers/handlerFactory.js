const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
// create a function that return a function


exports.deleteOne = Model =>
  catchAsync(async(req, res, next) => {
  const _id = req.params.id;
  const doc =  await Model.findByIdAndDelete({
    _id
  });
  if (!doc){
    return next(new AppError('No document found with that ID' , 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Deleted tour successfully',
    data: null
  });
});




