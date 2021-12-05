const User = require("../../db/models/User");
//Import Utils
const { createHash } = require("../../utils/createHash");
const { generateToken } = require("../../utils/createToken");

exports.register = async (req, res, next) => {
  try {
    req.body.password = await createHash(req.body.password);

    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const token = generateToken(req.user);
  res.status(200).json({ token });
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/media/${req.file.filename}`;
      req.body.image = req.body.image.replace("\\", "/");
    }

    await User.findByIdAndUpdate(req.user._id, {$set: {'profile': req.body}}, {
      new: true,
      runValidators: true,
    });

    const foundProfile = await User.findOne({ _id: req.user._id })
      .select('-password').populate();
    
    return res.status(201).json(foundProfile);
  } catch (error) {
    return next(error);
  }
};

exports.getProfileList = async (req, res, next) => {
  try {
    const profiles = await User.find().select('-password').populate();
    return res.status(200).json(profiles);
  } catch (error) {
    console.log(error);
  }
};

