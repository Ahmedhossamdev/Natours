const fs = require('fs');
const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');



exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


exports.getTourStats = catchAsync(async(req, res, next) => {

    const stats = await Tour.aggregate([{
        $match: {
            ratingsAverage: {
                $gte: 4.5
            }
        }
    }, {
        $group: {
            _id: {
                $toUpper: '$difficulty'
            },
            numRatings: {
                $sum: '$ratingsQuantity'
            },
            numTours: {
                $sum: 1
            },
            avgRating: {
                $avg: '$ratingsAverage'
            },
            avgPrice: {
                $avg: '$price'
            },
            minPrice: {
                $min: '$price'
            },
            maxPrice: {
                $max: '$price'
            }
        }
    }, {
        $sort: {
            avgPrice: 1
        }
    }]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});


exports.getMonthlyPlan = catchAsync(async(req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([{
        $unwind: '$startDates'
    }, {
        $match: {
            startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        }
    }, {
        $group: {
            _id: {
                $month: '$startDates'
            },
            numTourStarts: {
                $sum: 1
            },
            tours: {
                $push: '$name'
            }
        }
    }, {
        $addFields: {
            month: '$_id'
        },
    }, {
        $project: {
            _id: 0
        }
    }, {
        $sort: {
            numTourStarts: -1
        } //ascending
    }, {
        $limit: 12,
    }, ]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });

});






exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, {path :'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour =  factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
//
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour ID: ${val}`);
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };
//
// exports.checkBody = (req, res, next, val) => {
//   console.log(` body ${req.name}'   '${req.price}`);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'bad request'
//     });
//   }
//   next();
// };
//
//
// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// };
//
//
// exports.getTour = (req, res) => { // we created var named id here
//   const id = req.params.id * 1; // string to number (;
//   const tour = tours.find(el => el.id === id); // create array which only contains elements that match
//
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// };
//
// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour
//       }
//     }); // 201 stands for created
//
//   });
// };
//
// exports.updateTour = (req, res) => {
//   const updatedTour = Object.assign(tour, req.body);
//   const updatedTours = tours.map(tour => tour.id === updatedTour.id ? updatedTour : tour);
//   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), err => {
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: updatedTour
//       }
//     });
//   });
// };
//
// exports.deleteTour = (req, res) => {
//   const id = req.params.id * 1;
//   const updatedTours = tours.filter(el => el.id !== id);
//   fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), err => {
//     res.status(204).json({
//       status: 'success',
//       data: null
//     });
//   });
// };