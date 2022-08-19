const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/users.schema");
const { generateJWT } = require("../helpers/generateJWT");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {

    // Check if email exists 
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ 
            msg: "Email or password invalid - email" 
        });
    }

    // Check if user is active
    if (!user.state) {
        return res.status(400).json({ 
            msg: "Email or password invalid - status false" 
        });
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ 
            msg: "Email or password invalid - password" 
        });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Something went wrong, please try again. If the error persists,
            please contact an administrator.`,
    });
  }
};

module.exports = {
  login,
};
