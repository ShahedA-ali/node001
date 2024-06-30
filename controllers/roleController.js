const Role = require('../models/Role');
const catchAsync = require("../utils/catchAsync");

exports.create = catchAsync(async (req, res, next) => {
    const { roleName, roleDetail } = req.body;

    if (!roleName || !roleDetail) {
        return next(res.status(400).json({success: false, result: 'Please provide roleName and roleDetail.'})
        );
    }

    const newRole = await Role.create({roleName, roleDetail});

    res.status(201).json({
        status: 'success',
        data: {
            data: newRole,
        },
    });
});

