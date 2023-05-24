const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
// create a function that return a function


exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const _id = req.params.id;
    const doc = await Model.findByIdAndDelete({
      _id
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'Deleted tour successfully',
      data: null
    });
  });


exports.updateOne = Model => catchAsync(async (req, res, next) => {

  const _id = req.params.id;
  const doc = await Model.findByIdAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return next(new AppError('No document found with that id'));
  }
  res.status(200).json({
    status: 'success',
    message: 'Updated Document Successfully',
    data: {
      data: doc
    }
  });
});


exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc
    });
  });


exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });


exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)

    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };


    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    //const doc = await features.query.explain();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
