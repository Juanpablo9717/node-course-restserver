const { request, response } = require("express");

const validateAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "You want to verify the role without verifying the token first.",
    });
  }

  const { rol, name } = req.user;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name}: is not an Admin, you can't do this.`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  // Esto es una funcion que ejecuta el middleware, ya que el middleware tiene que
  // retornar una funcion, en este caso hasRole se ejecuta y retorna el middleware
  // Este es el que retorna la funcion que se ejecuta al fianl del middleware en la ruta
  // antes de llegar al controlador.

  // Pero hasRole es la que recibe los roles.

  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "You want to verify the role without verifying the token first.",
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(401).json({
        msg: `The service requires one of these roles ${roles} your user role is ${req.user.rol}`,
      });
    }

    next();
  };
};

module.exports = {
  validateAdminRole,
  hasRole,
};
