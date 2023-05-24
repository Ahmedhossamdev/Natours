// review , rating , createdAt / ref to tour / ref to user


const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema({
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

// TODO search about populate , photo
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate(
  //   {
  //     path: 'user',
  //     select: 'name photo'
  //   }
  // )
  this.populate(
    {
      path: 'user',
      select: 'name photo'
    }
  );
  next();
});


// Calculate the statistics if new Reviews are added
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage:  stats[0].avgRating
  });
};

reviewSchema.post('save', function() {
  // This point to the current review
  this.constructor.calcAverageRatings(this.tour);
});

// Calculate Average Rating
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;