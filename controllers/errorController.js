const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}


const handelDuplicateFieldDB = err => {


    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    console.log(value);
    const message = `Duplicate field value : ${value} Please ues another value !`;
    return new AppError(message, 400);
}

const handelValidationErrorDB = err=>{
  const errors =Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message,400);
}

const handelJWTError = ()=>  new AppError('Invalid token. Please log in again!' , 401);

const handleJWTExpiredError = () => new AppError('Your token has expired' , 401);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log('Error ): ' + err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong ! ',
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } 
  else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handelDuplicateFieldDB(error);
        if (error.name === 'ValidationError') error = handelValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handelJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        // will return a new error that created in our error
        sendErrorProd(error, res);
    }

};