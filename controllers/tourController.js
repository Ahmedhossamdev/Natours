const fs = require('fs');
const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');



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


exports.uploadTourImages = upload.fields([
    {name : 'imageCover' , maxCount : 1},
    {name : 'images' , maxCount : 3},
]);

// upload.single('image');
// upload.array('images' , 5);

exports.resizeTourImages = async (req , res , next) => {


    // if there is no image just go to the next middleware

    if (!req.files.imageCover || !req.files.images) return next();

    // 1)  Cover image
    //const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

    // 1) We need to use updateTour controller to update the doc
    // 2) so we need to get the req.body and add the coverImage into it
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({quality : 90})
      .toFile(`public/img/tours/${req.body.imageCover}`);
      //req.body.imageCover = imageCoverFilename;
    req.body.images = [];

    // map will save array of promises rather than using forEach method
     await Promise.all(req.files.images.map( async (file , i) => {
         const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

         await sharp(file.buffer)
           .resize(2000, 1333)
           .toFormat('jpeg')
           .jpeg({quality : 90})
           .toFile(`public/img/tours/${filename}`);

         req.body.images.push(filename);
     }));
    next();
}









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



// '/tours-within/:distance/center/34.031460, -118.712843/unit/:unit'

exports.getToursWithin = catchAsync ( async (req,res,next) => {
    const {distance , latlng , unit} = req.params;
    const[lat , lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;


    if (!lat || !lng){
        next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 404));
    }
    console.log(distance , lat , lng , unit);

    const tours = await Tour.find({startLocation :{$geoWithin: {$centerSphere: [[lng , lat] , radius] }}});


    res.status(200).json({
        status:'success',
        results : tours.length,
        data:{
            data: tours,
        }
    })
});


exports.getDistances = catchAsync(async (req,res,next) =>{
    const {latlng , unit} = req.params;
    const[lat , lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.00062137 : 0.001

    if (!lat || !lng){
        next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 404));
    }
    const distances =  await Tour.aggregate([
        {
            // should be first one
            $geoNear: {
                near : {
                    type : 'Point',
                    coordinates : [lng * 1, lat * 1]
                },
                distanceField : 'distance',
                distanceMultiplier : multiplier,
                spherical : true
            },
        },
        {
          $project:{
              distance: 1,
              name: 1
          }
        }
    ]);
    res.status(200).json({
        status:'success',
        data:{
            data: distances,
        }
    })
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