const UserModel = require("../models/User.model");

module.exports = async (req, res, next) => {
  try {
    // See line 14 in the isAuthenticated.js file
    const loggedInUser = req.user;

    const user = await UserModel.findOne(
      { _id: loggedInUser._id },
      { passwordHash: 0, __v: 0 } // Deletes the hash password which goes to tthe server for security reasons
    );

    if (user.transactions.length) {
      user.populate({
        path: "transactions",
        model: "Transaction",
      });
    }

    if (!user) {
      // 400 Bad Request
      return res.status(400).json({ msg: "User does not exist." });
    }

    req.currentUser = user;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
};
