const express = require('express');
const authController = require('./../controllers/authController');
const reportController = require('./../controllers/reportsController');

const router = express.Router();

// router.get('/sad-general', authController.protect, authController.restrictTo(['ADMIN']), reportController.sadGeneralSegment);
router.get('/sad-general', reportController.sadGeneralSegment);

module.exports = router;