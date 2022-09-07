const { Router } = require("express");
const { check } = require("express-validator");
const {
  validateFields,
  validateJWT,
  hasRole,
} = require("../middlewares");

const {
  isRoleValid,
  existEmail,
  existUSerById,
} = require("../helpers/db-validators");

const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
} = require("../controllers/users.controller");

const router = Router();

router.get(
  "/",
  [
    check("limit", "The limit value must be a number").optional().isNumeric(),
    check("from", "The from value must be a number").optional().isNumeric(),
    validateFields,
  ],
  usersGet
);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check(
      "password",
      "Password is required and must be minimum 6 characters"
    ).isLength({ min: 6 }),
    check("email", "Email not valid").isEmail(),
    check("rol").custom(isRoleValid),
    check("email").custom(existEmail),
    validateFields,

    // La funcion recibe 3 parametros req, res, next()
    // Estos se pasan por defecto ya que los middlewares tienen acceso a estos
    // Los extrae y los pasa por defecto
    // Este seria un ejemplo de la manera larga

    // ( req, res, next ) => {
    //   validateFields(req, res, next);
    // }
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "Id not valid").isMongoId(),
    check("id").custom(existUSerById),
    check("rol").custom(isRoleValid),
    validateFields,
  ],
  usersPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    // validateAdminRole,
    hasRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "Id not valid").isMongoId(),
    check("id").custom(existUSerById),
    validateFields,
  ],
  usersDelete
);

router.patch("/", usersPatch);

module.exports = router;
