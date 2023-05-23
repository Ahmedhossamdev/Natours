const express = require('express');
const router = express.Router();
const {getAllUsers , getUser , updateUser , deleteUser , createUser , updateMe , deleteMe , getMe} = require('./../controllers/userController');
const{signup , login , forgotPassword , resetPassword , updatePassword , protect ,   restrictTo} = require('./../controllers/authController');



router.get('/me' , protect , getMe , getUser);

router.post('/signup' , signup);
router.post('/login' , login);
router.use(protect);
router.post('/forgotPassword' , forgotPassword);
router.patch('/resetPassword/:token' , resetPassword);





router.patch('/updateMyPassword' , updatePassword);
router.patch('/updateMe' , updateMe);
router.delete('/deleteMe' , deleteMe);

// Rest format

router.use(restrictTo('admin'));
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
