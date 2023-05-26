const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync( async (req,res) =>{
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build Template
  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
     title: 'All Tours',
     tours
  });
});


exports.getTour =  catchAsync(async (req,res)=>{
 // 1) get the data, for the requested tour (including review and guides)
  const tourSlug = req.params.tourSlug;
  const tour = await Tour.findOne({slug: tourSlug}).populate({
    path:'reviews',
    populate: {
      path: 'user',
      select: 'review rating user'
    }
  });

 // 2) Build Template

 // 3) Render that template using tour data from 1
  res.status(200).render('tour',{
    title: tourSlug + ' Tour',
    tour
  });
});