const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/users.schema");
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Email or password invalid - email",
      });
    }

    // Check if user is active
    if (!user.state) {
      return res.status(400).json({
        msg: "Email or password invalid - status false",
      });
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Email or password invalid - password",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Something went wrong, please try again. If the error persists,
            please contact an administrator.`,
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, picture } = await googleVerify(id_token);

    let user = await User.findOne({ email });
    if (!user) {
      // Create user if doesn't exist
      const data = {
        name,
        email,
        password: ":P",
        img: picture,
        rol: "USER_ROLE",
        google: true,
      };

      user = new User(data);

      await user.save();
    }

    // if user exists in DB, but the status is false

    if (!user.state) {
      return res.status(401).json({
        msg: "Talk with an Admin, user is blocked",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Token failed to authorize.",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
