const Roles = require("../models/Role");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.findMany({}).then(async (users) => {
    let data = []
    for (const user of users) {
      const { password, ...userNoPassword } = user;
      const roles = await Roles.findMany({ userId: userNoPassword.id }).then(roles => roles.roles.map(role => role.role_name));
      userNoPassword.roles = roles;
      data.push(userNoPassword)
    }
    return data
  }
  );

  res.status(200).json({
    success: true,
    data: {
      users: users,
    },
  });
});


exports.getOne = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const user = await User.findOne({ id }).then(async (user) => {
    if (!user) {
      return next(res.send({message: 'No user with this id', status: 404}))
    }
    const roles = await Roles.findMany({ userId: id }).then(roles => roles.roles.map(role => role.role_name));
    user.roles = roles
    return user
  }
  );
  const { password, ...userNoPassword } = user;

  res.status(200).json({
    success: true,
    data: {
      userNoPassword,
    },
  });
});


exports.deleteOne = catchAsync(async (req, res, next) => {
  const id = req.params.id
    const user = await User.findAndDelete({ id })
    console.log(user)
    if (user !== 1) {
      return next(res.send({message: 'No user with this id', status: 404}))
    }

  res.status(200).json({
    success: true,
    data: {
      message: `User with id=${id} deleted`
    },
  });
});



// exports.getOne = catchAsync(async (req, res, next) => {
//   const id = req.params.id
//   const user = await User.findOne({ id }).then(async (user) => {
//     const roles = await Roles.findMany({ userId: id }).then(roles => roles.roles.map(role => role.role_name));
//     user.roles = roles
//     return user
//   }
//   );
//   const { password, ...userNoPassword } = user;

//   res.status(200).json({
//     success: true,
//     data: {
//       userNoPassword,
//     },
//   });
// });

