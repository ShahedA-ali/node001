const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Role = require('../models/Role')
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util');
const validate = require('../models/validators/validate');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    console.log(res.cookie())
    // Remove password from output
    user.password = undefined;
    user.id = undefined

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user,
        },
    });
};

exports.login = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log(req.body)

    // 1) Check if username exist if no email should exist and password must exist
    if (!username && !email || !password) {
        return next(res.send({ message: 'Please provide email or username and password!', status: 400 }));
    }

    // 3) Check if user exists && password is correct
    // find the user by username or by email
    const user = await User.findOne({ username: username, email: email || username })
    console.log(user)
    const cryptPassword = crypto.createHash('sha256').update(password + process.env.SECRET_KEY).digest('hex')
    if (!user || user.password !== cryptPassword) {
        return next(res.send({ message: 'Incorrect email or password', status: 401 }))
    }

    // 4) accumulate user roles
    // find user roles
    const roles = await Role.findMany({ userId: user.id });
    if (!roles.count) {
        return next(res.send({ message: 'Invalid user, no roles', status: 403 }))
    }
    // add to users the roles
    // user.roles = roles.roles.map(role => role.role_name);

    // 5) If everything ok, send token to client
    createSendToken(user, 200, res);

    // res.send({result: user})
})

exports.register = catchAsync(async (req, res, next) => {
    const { username, password, email, roles } = req.body

    // 1) Check whether username, password and email are valid
    if (roles.length < 1) {
        return next(res.send({message: 'User should have a role'}))
    }
    if (!validate.username(username)) {
        return next(res.send({message: 'Wrong username'}))
    }
    // if username is like email it is wrong
    if (validate.email(username)) {
        return next(res.send({message: 'Wrong username'}))
    }
    if (!validate.email(email)) {
        return next(res.send({message: 'Wrong email'}))
    }
    if (!validate.password(password)) {
        return next(res.send({message: 'Wrong password'}))
    }
    // 2) Encrypt the Password
    const cryptPassword = crypto.createHash('sha256').update(password + process.env.SECRET_KEY).digest('hex')

    // 2) Create User if error return the error
    const newUser = await User.create({ username, password: cryptPassword, email })
    if (newUser !== 1) {
        console.log(newUser.message)
        const duplicateError = newUser.detail.split('=')[0]
        let error;
        switch (duplicateError) {
            case 'Key (username)':
                error = 'Duplicate username!'
                break;

            case 'Key (email)':
                error = 'Duplicate email!'
                break;

            default:
                break;
        }
        console.log(error)
        return next(res.status(403).json({success: false, message: error}))
    }
    // console.log(roles, 'sldkfj')
    // const roleIds = await Role.findMany({roleName: roles})
    // .then(res => res.roles.map(item => item.id))
    // console.log(roleIds)
    const user = await User.findOne({username})
    console.log(user)
    try {
        const rolesForUser = await Role.addManyUserRoles({userId: user.id, roleId: roles.map(role => role.id)})
        // console.log(rolesForUser)
        newUser.roles = rolesForUser
    } catch (error) {
        const deleteUser = await User.findAndDelete({id: user.id})
        console.log(error, deleteUser)
        return next(res.status(400).json({success: false, message: error}))
    }


    createSendToken(newUser, 201, res);
})

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log(token)

    if (!token) {
        return next(
            new Error(
                'You are not logged in! Please log in to get access.',
                401
            )
        );
    }

    // 2) Verification token
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        console.log(decoded)
        
        // 3) Check if user still exists
        const currentUser = await User.findOne({ id: decoded.id });
        if (!currentUser) {
            return next(
                new Error(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }

        // 4) Check if user changed password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //     return next(
        //         new Error(
        //             'User recently changed password! Please log in again.',
        //             401
        //         )
        //     );
        // }

        // 
        const roles = await Role.findMany({ userId: decoded.id })
        if (!roles.count) {
            return next(res.send({success: false, result: 'Invalid user, no roles', status: 403 }))
        }
        const arrayOfRolesForUser = roles.roles.map(item => item.role_name)
        currentUser.roles = arrayOfRolesForUser
        // GRANT ACCESS TO PROTECTED ROUTE
        currentUser.password = undefined;
        currentUser.id = undefined;
        req.user = currentUser;
        console.log(req.user)
        next();
    } catch (error) {
        res.json(error)
    }

});

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        console.log(req.user.roles, roles)
        console.log(roles.some(role => req.user.roles.includes(role)))
        if (!roles.some(role => req.user.roles.includes(role))) {
            return next(res.send({ success: false, result: 'You do not have permission to perform this action', status: 403 }))
        }

        next();
    };
};

exports.verify = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    })
})

exports.add = catchAsync(async (req, res, next) => {
    const a = await Role.findMany({roleName: ['ADMIN', 'SAD_GENERAL_SEGMENT']}).then(res => res.roles.map(item => item.id))
    console.log(a)
    res.status(200).json({
        status: 'success',
        data: { 'a': a }
    })
})

//////////////////       Create roles function and endpoint
