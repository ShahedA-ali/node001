const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + 24*60*60*1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.login = catchAsync(async (req, res, next) => {
    const {username, email, password} = req.body;
    
    // 1) Check if username exist if no email should exist and password must exist
    if (!username.trim() && !email.trim() || !password.trim()) {
        return next(new Error('Please provide email or username and password!', 400));
    }
    // 2) Check if user exists && password is correct
    // find the user by username or by email
    const user = await User.findOne({username: username, email: email })
    if (!user || user.password !== password) {
        return next(new Error('Incorrect email or password', 401))
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);

    // res.send({result: user})
})

exports.register = catchAsync(async (req, res, next) => {
    const {username, password, email, role} = req.body

    // 1) Check whether username, password and email are valid


    // 2) Encrypt the Password
    const cryptPassword = crypto.createHash('sha256').update(password+process.env.SECRET_KEY).digest('hex')

    // 2) Create User if error return the error
    const newUser = await User.create({username, password: cryptPassword, email})
    if (newUser !== 1) {
		console.log(newUser.detail == 'Key (email)=(ali@gmail.com) already exists.')
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
		return next(new Error('error'), 403)
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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findOne({id: decoded.id});
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

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});


//////////////////       Create roles function and endpoint
