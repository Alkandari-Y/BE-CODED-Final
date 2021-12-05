const Profile = require("../../db/models/Profile");
const User = require("../../db/models/User");
//Import Utils
const { createHash } = require("../../utils/createHash");
const { generateToken } = require("../../utils/createToken");

exports.register = async (req, res, next) => {
  try {
    req.body.password = await createHash(req.body.password);

    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    const userProfile = await Profile.create({ user: newUser._id });
    await newUser.updateOne({ profile: userProfile._id });
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const token = generateToken(req.user);
  res.status(200).json({ token });
};
