const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const { promisify } = require('util');
const Email = require('./../utils/email');


const createSendToken = (user, statusCode, req ,res) => {
  const token = signToken(user._id);


  res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: (req.secure || req.headers['x-forwarded-photo'] === 'https')
  });
  // remove password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role
  });

  const url = `${req.protocol}://${req.hostname}:3000/me`;
  // console.log(url);
  await new Email(newUser , url).sendWelcome();
  createSendToken(newUser, 201, req , res);
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!'), 400);
  }
  // 2) Check if user exists and password correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //3) If everything ok , send token to client
  createSendToken(user, 200, req ,res);
});


exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    // httpOnly: true
  });
  res.status(200).json({
    status: 'success',
    message: 'You have been logged out'
  });
};

exports.protect = catchAsync(async (req, res, next) => {

  // 1)Getting token and check if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }
  if (!token) return res.redirect('/');

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);
  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The token belonging to this user does no longer exist', 401));
  }

  // 4) Check if user changed password after the token was updated
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again', 401));
  }

  // Grant acess to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});


// Only for rendered pages , no errors !
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // 4) Check if user changed password after the token was updated
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    }
  }
  catch (err) {
    return next();
  }
  next();
};


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array [admin , lead]
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on Posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message
    // });

    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
  //   const message = `Forgot your password? Submit A Patch requset with your new password and passwordConfirm to :
  // ${resetURL}.\nIf you didn't forgot your password, please ignore this email!`;
    await new  Email(user , resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  }
  catch (err) {
    user.createPasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken, passwordResetExpires: {
      $gt: Date.now()
    }
  });

  // 2 set the new password if token is not expired
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPassword At property for the user


  // 4) Log the user inm send JWT
  createSendToken(user, 200, req ,res);
});


exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get the user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) check if posted current pass is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }
  // 3) if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //user.findByIdAndUpdate() will not work


  // 3) log user in , send jwt
  createSendToken(user, 200, req ,res);
});