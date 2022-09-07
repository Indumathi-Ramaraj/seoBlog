const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      // res.json({
      //   user: success,
      // });
      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  //check if user exsit
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with the email does not exist. Please signup" });
    }

    //authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Email and password do not match" });
    }

    //generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { expiresIn: "1d" });
    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.auth._id;
  console.log("authUserId..............", authUserId);
  User.findById({ _id: authUserId }).exec((err, auth) => {
    if (err || !auth) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = auth;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  // console.log("ReqAdmin......", req);
  const adminUserId = req.auth._id;
  console.log("adminUserId..........", adminUserId);
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }
    req.profile = user;
    next();
  });
};
