
const User = require('./../models/userModel');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');



const filterObj = (obj , ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)){
      newObj[key] = obj[key];
    }
  })
  return newObj;
}


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    date: {
      users
    }
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !'
  });
};

exports.deleteMe = catchAsync (async (req, res) => {
  await User.findByIdAndUpdate(req.user.id , {active: false});

  res.status(204).json({
    status : 'success',
    data: null,
  });
});


exports.deleteUser = (req, res , next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !'
  });
}
exports.updateMe = catchAsync ( async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates, please use /updateMypassword', 400));
  }
  // filter out unwanted keys
  const filteredBody = filterObj(req.body , 'name' , 'email');
  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody ,{
    new : true ,
    runVaildators : true,
  });
  res.status(200).json({
    status : 'success',
    data:{
      user: updatedUser
    }
  })
  // Rest of your code goes here
});
