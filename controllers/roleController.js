const Role = require('../models/Role');
const User = require('../models/User');
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

exports.updateUserRoles = catchAsync(async (req, res, next) => {
    const {username, roles} = req.body;

    if (!username || !roles) {
        return next(res.status(400).json({success: false, result: 'Please provide a username and roles array for the username.'})
        );
    }

    const user = await User.findOne({username});
    console.log(user)
    if (!user || !Array.isArray(roles)) {
        return res.status(403).json({success: false, result: 'Provide valid credintials!'})
        }
        
    const allRoles = await Role.findMany({}).then(res => res.roles.map(role => role.role_name));
    console.log(allRoles)
    for (let index = 0; index < roles.length; index++) {
        if (!allRoles.includes(roles[index])) {
            return res.status(403).json({success: false, result: `<<${roles[index]}>> is not a valid role!`})
        }
        
    }

    const userRoles = await Role.findMany({userId: user.id}).then(res => res.roles.map(role => role.role_name));
    const userRolesSet = new Set(userRoles);
    const rolesSet =  new Set(roles);
    

    
    res.json({success: true, result: userRoles})
})

