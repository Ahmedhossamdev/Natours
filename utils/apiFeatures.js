class APIFeatures {

  /*
 queryString
 {
  difficulty: 'easy',
  duration: { gte: '5' },
  sort:
  '-price,ratingsAverage'
  }

   */
  constructor(model, queryString) {
    this.query = model;
    this.queryString = queryString;
  }

  filter(){

    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));// Like that Tour.find(JSON.parse(queryStr))
    return this;
  }


  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('_id');
    }
    return this; //entire object
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      //console.log(fields);
      //   query = query.select(name difficulty price); like this
      this.query = this.query.select(fields);
    }
    else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //page=3&&limit=10 , page1 1:10 , page2 11:20 , page3 21 :30
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


module.exports = APIFeatures;