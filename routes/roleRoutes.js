const express = require('express');
const roleController = require('./../controllers/roleController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/add', authController.protect, authController.restrictTo(['ADMIN']), roleController.create);

module.exports = router;