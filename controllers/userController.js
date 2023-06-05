
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');



// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

// Test_if_the_uploaded_file_is_image
const multerFilter = (req , file , cb) =>{
  if (file.mimetype.startsWith('image')){
    cb(null , true);
  }
  else {
    cb(new AppError('Not an image! Please upload only images' , 400) , false);
  }
}

const upload= multer( {
  storage : multerStorage,
  fileFilter : multerFilter
});


exports.uploadUserPhoto =  upload.single('photo');

exports.resizeUserPhoto = async (req, res , next) =>{

  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500 , 500)
    .toFormat('jpeg')
    .jpeg({quality : 90})
    .toFile(`public/img/users/${req.file.filename}`);

  next();
}

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
  if (req.file) filteredBody.photo = req.file.filename;
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