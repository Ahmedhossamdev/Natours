const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');



const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();



app.set('view engine' , 'pug');
app.set('views' , path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// 1) MIDDLEWARES
// Security http headers
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
app.use(express.json({ limit  : '10kb' }));


app.use(express.urlencoded({extended : true , limit: '10kb'}));
app.use(cookieParser());

// Serving static files
// Middleware function can modify incoming request data json to native javascript
app.use(express.json());

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
  //console.log(req.cookies);
  next();
});

const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');



app.use('/', viewRouter);
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



