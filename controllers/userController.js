
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj , ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)){
      newObj[key] = obj[key];
    }
  })
  return newObj;
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use signup instead'
  });
};



exports.deleteMe = catchAsync (async (req, res) => {
  await User.findByIdAndUpdate(req.user.id , {active: false});

  res.status(204).json({
    status : 'success',
    data: null,
  });
});


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

// Login in user pass the id to the req.params.id to pass it to factory function
exports.getMe  = (req ,res , next) => {
  req.params.id = req.user.id;
  next();
}



exports.getAllUsers =  factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);