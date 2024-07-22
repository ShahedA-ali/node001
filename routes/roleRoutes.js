const express = require('express');
const roleController = require('./../controllers/roleController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/add', authController.protect, authController.restrictTo(['ADMIN']), roleController.create);
// router.post('/update_user_roles', authController.protect, authController.restrictTo(['ADMIN']), roleController.);
// router.get('/get_all_roles', authController.protect, authController.restrictTo(['ADMIN']), roleController.getAllRoles);
router.get('/get_all_roles', roleController.getAllRoles);

module.exports = router;