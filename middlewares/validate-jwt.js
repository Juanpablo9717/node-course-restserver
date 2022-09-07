const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/user.schema");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request.",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);
    const userAuth = await Users.findById(uid);

    // Verify if user exists in DB

    if (!userAuth) {
      return res.status(401).json({
        msg: "User does not exist in DB.",
      });
    }

    // Verify if user state is active

    if (!userAuth.state) {
      return res.status(401).json({
        msg: "Invalid token | User was deleted.",
      });
    }

    // Return user authenticated

    req.user = userAuth;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Invalid token.",
    });
  }
};

module.exports = {
  validateJWT,
};
