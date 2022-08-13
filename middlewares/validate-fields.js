const { validationResult } = require('express-validator');

// 'Next': is a function that is execute if the validation its ok

const validateFields = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors });
  }
  
  next();
};

module.exports = {
  validateFields,
};
