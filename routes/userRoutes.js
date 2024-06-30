const express = require('express');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/pro', authController.protect, authController.restrictTo(['DEC_REF_YER']), authController.add);

module.exports = router;