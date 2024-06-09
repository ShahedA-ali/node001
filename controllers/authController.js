const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
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
    // createSendToken(user, 200, res);

    res.send({result: user})
})

exports.register = catchAsync(async (req, res, next) => {

})


// app.get('/login', async (req, res) => {
//     try {
//       console.log('first')
//       const result = await db.query('SELECT * FROM users');
//       console.log(result.rows);
//       res.send({result: 'okay'})
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     }
//   })
  
//   app.post('/register', async(req, res) => {
//     const {username, email, password} = req.body
//     try {
//       console.log(username, email, password)
//       // const newUser = await db.query(`INSERT INTO users(username, password, email) VALUES('ahmad','ahmad','ahmad@gmail.com')`)
//       const newUser = await db.query(`INSERT INTO users(username, password, email) VALUES('${username}', '${password}', '${email}');`)
//       res.send({result: newUser})
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     }
//   })