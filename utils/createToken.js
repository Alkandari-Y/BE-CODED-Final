require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = (userObj) => {
  const payload = {
    _id: userObj._id,
    profile: userObj.profile.name,
    SMSToken: userObj.SMSToken,
    isValidated: userObj.isValidated
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });

  return token;
};
