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

exports.updateUserRoles = catchAsync(async (req, res, next) => {

    const { username, roles } = req.body;

    /* Roles should be in this format
    "roles": [
                {
                    "id": 1,
                    "role_name": "ADMIN",
                    "role_detail": "Can perform every role"
                },
                {
                    "id": 2,
                    "role_name": "DEC_REF_YER",
                    "role_detail": ""
                }, */

    if (!username || !roles) {
        return next(res.status(400).json({ success: false, result: 'Please provide a username and roles array for the username.' })
        );
    }

    const user = await User.findOne({ username });
    console.log(user)
    if (!user || !Array.isArray(roles)) {
        return res.status(403).json({ success: false, result: 'Provide valid credintials!' })
    }


    const allRoles = await Role.findMany({}).then(res => res.roles.map(role => role.role_name));
    for (let index = 0; index < roles.length; index++) {
        if (!allRoles.includes(roles[index].role_name)) {
            return res.status(403).json({ success: false, result: `<<${roles[index].role_name}>> is not a valid role!` })
        }
    }

    const userRoles = await Role.findMany({ userId: user.id }).then(res => res.roles.map(role => role.id));
    const userRolesSet = new Set(userRoles);
    const newRolesSet = new Set(roles.map(role => role.id));

    console.log(userRolesSet, newRolesSet)

    const rolesToDelete = userRolesSet.difference(newRolesSet)
    const rolesToAdd = newRolesSet.difference(userRolesSet)
    console.log(user.id, [...rolesToDelete])
    const deleteRolesFromUser = await Role.deleteManyUserRoles({userId: user.id, roleId: [...rolesToDelete]});
    const addRolesToUser = await Role.addManyUserRoles({userId: user.id, roleId: [...rolesToAdd]});


    res.json({ success: true, result: {update: {delete: deleteRolesFromUser, add: addRolesToUser}} })
})

