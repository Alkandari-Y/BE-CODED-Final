require("dotenv").config();
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models/User");


exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ phoneNumber: username });
    const passwordMath = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordMath) return done(null, user);

    return done(null, false);
  } catch (error) {
    return done(error);
  }
});

exports.JWTStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    const exp = payload.exp * 1000;
    if (Date.now() > exp) {
      return done(null, false);
    }
    try {
      const user = await User.findById(payload._id);
      return done(null, user);
    } catch {
      return done(error);
    }
  }
);
