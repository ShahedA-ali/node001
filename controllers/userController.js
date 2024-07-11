const Roles = require("../models/Role");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.all = catchAsync(async (req, res, next) => {
  const users = await User.findMany({}).then(async (users) =>
    users.map(async (user) => {
      const { password, ...userNoPassword } = user;
      const roles = await Roles.findMany({ userId: userNoPassword.id });
      userNoPassword.roles = roles.roles;
      return userNoPassword;
    })
  );

  res.status(200).json({
    success: true,
    data: {
      users: users,
    },
  });
});
