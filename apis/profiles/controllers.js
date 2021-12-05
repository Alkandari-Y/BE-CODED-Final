const Profile = require("../../db/models/Profile");

//Find User
exports.findUserProfileById = async (profileId, next) => {
  try {
    const foundProfile = await Profile.findById(profileId);
    return foundProfile;
  } catch (error) {
    next(error);
  }
};

exports.returnNewUserProfile = async (req, res, next) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user._id }).populate(
      { path: "user", select: "username" }
    );
    res.status(200).json(foundProfile);
  } catch (error) {
    console.log(error);
  }
};

//Get Profiles List
exports.getProfileList = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate({
      path: "user",
      select: "username",
    });
    return res.status(200).json(profiles);
  } catch (error) {
    console.log(error);
  }
};

// Editing Profile
exports.updateProfile = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/media/${req.file.filename}`;
      req.body.image = req.body.image.replace("\\", "/");
    }
    await Profile.findByIdAndUpdate(req.profile, req.body, {
      new: true,
      runValidators: true, // returns updated products
    });
    const foundProfile = await Profile.findOne({ user: req.user._id }).populate(
      { path: "user", select: "username" }
    );
    return res.status(201).json(foundProfile);
  } catch (error) {
    return next(error);
  }
};
