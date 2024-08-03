const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');


const router = express.Router();


router.get('/', authController.protect, authController.restrictTo(['ADMIN']), userController.getAll)
router.get('/:id', userController.getOne)
router.delete('/:id', userController.deleteOne)
router.put('/:id', userController.updateOne)

module.exports = router;