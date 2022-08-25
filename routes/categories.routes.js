const { Router } = require('express')
const { validateJWT, validateFields, validateAdminRole } = require('../middlewares')
const { check } = require('express-validator')
const { existCategory } = require('../helpers/db-validators')

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller')

const router = Router()

//Get categories - public
router.get(
  '/',
  [
    check('limit', 'The limit value must be a number').optional().isNumeric(),
    check('from', 'The from value must be a number').optional().isNumeric(),
    validateFields,
  ],
  [getCategories]
)

// get category by id - public
router.get(
  '/:id',
  [
    check('id', 'Id not valid').isMongoId(),
    check('id').custom(existCategory),
    validateFields,
  ],
  getCategory
)

// Create category - private - user with valid token
router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
  ],
  createCategory
)

// Update Category - private - user with valid token
router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('id').custom(existCategory),
    validateFields,
  ],
  updateCategory
)

// Delete Category - private - Admin ( Change state to false )
router.delete(
  '/:id',
  [
    // Validate JWT first, then validate Role
    validateJWT,
    validateAdminRole,
    check('id', 'Id not valid').isMongoId(),
    check('id').custom(existCategory),
    validateFields,
  ],
  deleteCategory
)

module.exports = router
