const catchAsync = require("../utils/catchAsync");

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new Error('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await db.query(`SELECT * FROM users WHERE email = '${email}' or username = '${email}`);

    // if (!user || !(await user.correctPassword(password, user.password))) {
    //     return next(new AppError('Incorrect email or password', 401));
    // }

    // 3) If everything ok, send token to client
    // createSendToken(user, 200, res);

    res.send({result: user})
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