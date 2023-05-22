const express = require('express');
const router = express.Router();
const {getAllUsers , getUser , updateUser , deleteUser , createUser , updateMe , deleteMe} = require('./../controllers/userController');
const{signup , login , forgotPassword , resetPassword , updatePassword , protect ,   restrictTo} = require('./../controllers/authController');

router.post('/signup' , signup);
router.post('/login' , login);
router.post('/forgotPassword' , forgotPassword);
router.patch('/resetPassword/:token' , resetPassword);
router.patch('/updateMyPassword' , protect , updatePassword);
router.patch('/updateMe' , protect, updateMe);
router.delete('/deleteMe' , protect, deleteMe);


// Rest format
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
