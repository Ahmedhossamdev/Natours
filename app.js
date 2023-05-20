const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


// 1) MIDDLEWARES

//Security http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 req for the same ip
  message: 'Too many requests from this IP , please try again in an hour!'
});


app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));

// Serving static files
app.use(express.json()); //middleware function can modify incoming request data json to native javascript
app.use(express.static(`${__dirname}/public`));

// Data sanitization against noSql query injection
app.use(mongoSanitize()); // remove all $


// Data sanitization against xss
app.use(xss());

// using last parameter sort=duration&sort=price will sort by price
app.use(hpp({
    whitelist:
      ['duration',
      'ratingQuantity'
      , 'ratingsAverage'
      , 'maxGroupSize'
      , 'difficulty'
      , 'price'
      ]
  }
));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews' , reviewsRouter);


// Handling unhandled routes

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`));
});


// Error Handling middleware
app.use(globalErrorHandler);
// 4) Start Server
module.exports = app;



