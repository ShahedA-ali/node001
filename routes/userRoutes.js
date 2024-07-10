const express = require('express');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/pro', authController.protect, authController.restrictTo(['ADMIN']), authController.add);
router.get('/verify', authController.protect, authController.verify);
router.get('/a', authController.add);

module.exports = router;