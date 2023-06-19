const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');


exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build Template
  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});


// Details page
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour (including review and guides)
  const tourSlug = req.params.tourSlug;
  const tour = await Tour.findOne({ slug: tourSlug }).populate({
    path: 'reviews',
    populate: {
      path: 'user',
      fields: 'review rating user'
    }
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2) Build Template
  // 3) Render that template using tour data from 1
  res.status(200).render('tour', {
    title: tourSlug + ' Tour',
    tour
  });
});

// Signup page

exports.getSignUp = (req , res) =>{
   res.status(200).render('signup', {
     title : 'Sign Up',
   })
}

exports.getResetPassword = (req , res) =>{
  res.status(200).render('resetpassword', {
    title : 'Reset Password',
  })
}

exports.getForgotPassword = (req , res) =>{
  res.status(200).render('forgotpassword', {
    title : 'Forget Password',
  })
}
// Login page
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into you account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

// Instead of doing populate
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  console.log(bookings);
  // 2) Find Tours with the returned ID'S
  const tourIDs = bookings.map(el => {return el.tour});
  console.log(tourIDs);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview' , {
     title : 'My Tours',
     tours,
  });
});


exports.updateUserData = catchAsync(async (req, res, next) => {
  // const updatedUser = await User.findByIdAndUpdate(req.user.id, {
  //     name: req.body.name,
  //     email: req.body.email
  //   },
  //   {
  //     new: true,
  //     runValidators: true
  //   }
  // );
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user
  });

});