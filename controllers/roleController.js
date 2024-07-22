const Role = require('../models/Role');
const User = require('../models/User');
const catchAsync = require("../utils/catchAsync");

// Extending the Set prototype to add a difference method
Set.prototype.difference = function (otherSet) {
    return new Set([...this].filter(elem => !otherSet.has(elem)));
};

exports.create = catchAsync(async (req, res, next) => {
    const { roleName, roleDetail } = req.body;

    if (!roleName || !roleDetail) {
        return next(res.status(400).json({ success: false, result: 'Please provide roleName and roleDetail.' })
        );
    }

    const newRole = await Role.create({ roleName, roleDetail });

    res.status(201).json({
        status: 'success',
        data: {
            data: newRole,
        },
    });
});

exports.getAllRoles = catchAsync(async (req, res, next) => {

    const roles = await Role.get({});

    res.status(201).json({
        status: 'success',
        data: {
            data: roles,
        },
    });
});


