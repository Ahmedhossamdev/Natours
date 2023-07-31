An awesome tour booking site built on top of NodeJS.
Demo • Key Features • Demonstration • How To Use • API Usage • Deployment • Build With • To-do • Installation • Known Bugs • Future Updates • Acknowledgement

Deployed Version
Live demo (Feel free to visit) 👉 : https://lgope-natours.onrender.com/

Key Features
Authentication and Authorization
Login and logout
Tour
Manage booking, check tours map, check users' reviews and rating
User profile
Update username, photo, email, and password
Credit card Payment
Demonstration
Home Page :
natoursHomePageonline-video-cutt


Tour Details :
tourOverviewonline-video-cutterc


Payment Process :
paymentprocess-1-ycnhrceamp4-7fW


Booked Tours :
rsz_bookedtours

User Profile :
rsz_userprofile

Admin Profile :
rsz_adminprofile

How To Use
Book a tour
Login to the site
Search for tours that you want to book
Book a tour
Proceed to the payment checkout page
Enter the card details (Test Mood):
- Card No. : 4242 4242 4242 4242
- Expiry date: 02 / 22
- CVV: 222
Finished!
Manage your booking
Check the tour you have booked in "Manage Booking" page in your user settings. You'll be automatically redirected to this page after you have completed the booking.
Update your profile
You can update your own username, profile photo, email and password.
API Usage
Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:

- {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
- {{password}} with your user password as value.
Check Natours API Documentation for more info.

API Features:

Tours List 👉 https://lgope-natours.onrender.com/api/v1/tours

Tours State 👉 https://lgope-natours.onrender.com/api/v1/tours/tour-stats

Get Top 5 Cheap Tours 👉 https://lgope-natours.onrender.com/api/v1/tours/top-5-cheap

Get Tours Within Radius 👉 https://lgope-natours.onrender.com/api/v1/tours/tours-within/200/center/34.098453,-118.096327/unit/mi

Deployment
The website is deployed with git into heroku. Below are the steps taken:

git init
git add -A
git commit -m "Commit message"
heroku login
heroku create
heroku config:set CONFIG_KEY=CONFIG_VALUE
parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js
git push heroku master
heroku open
You can also changed your website url by running this command:

heroku apps:rename natours-users
Build With
NodeJS - JS runtime environment
Express - The web framework used
Mongoose - Object Data Modelling (ODM) library
MongoDB Atlas - Cloud database service
Pug - High performance template engine
JSON Web Token - Security token
ParcelJS - Blazing fast, zero configuration web application bundler
Stripe - Online payment API
Postman - API testing
Mailtrap & Sendgrid - Email delivery platform
Heroku - Cloud platform
To-do
Review and rating
Allow user to add a review directly at the website after they have taken a tour
Booking
Prevent duplicate bookings after user has booked that exact tour, implement favourite tours
Advanced authentication features
Signup, confirm user email, login with refresh token, two-factor authentication
And More ! There's always room for improvement!
Installation
You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the dependencies by running

$ npm i
set your env variables
$ npm run watch:js
$ npm run build:js
$ npm run dev (for development)
$ npm run start:prod (for production)
$ npm run debug (for debug)
$ npm start
Setting up ESLint and Prettier in VS Code 👇
$ npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node
eslint-plugin-import eslint-plugin-jsx-a11y  eslint-plugin-react --save-dev
Known Bugs
Feel free to email me at lakshman.gope2@gmail.com if you run into any issues or have questions, ideas or concerns. Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

Future Updates
Enable PWA
Improve overall UX/UI and fix bugs
Featured Tours
Recently Viewed Tours
And More ! There's always room for improvement!
Acknowledgement
This project is part of the online course I've taken at Udemy. Thanks to Jonas Schmedtmann for creating this awesome course! Link to the course: Node.js, Express, MongoDB & More: The Complete Bootcamp 2019
