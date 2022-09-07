const { Router } = require('express')
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller')

const { check } = require('express-validator')
const {
  validateJWT,
  validateFields,
  validateAdminRole,
} = require('../middlewares')

const { existProduct, existCategory } = require('../helpers/db-validators')

const router = Router()

// Get categories
router.get(
  '/',
  [
    check('limit', 'The limit value must be a number').optional().isNumeric(),
    check('from', 'The from value must be a number').optional().isNumeric(),
    validateFields,
  ],
  getProducts
)
// Get Product by ID
router.get(
  '/:id',
  [
    check('id', 'Id not valid').isMongoId(),
    check('id').custom(existProduct),
    validateFields,
  ],
  getProduct
)

// Create Product
router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category').custom(existCategory),
    check('category', 'ID not valid').isMongoId(),
    validateFields,
  ],
  createProduct
)

// Update Product
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'ID not valid').isMongoId(),
    check('id').custom(existProduct),
    check('name', 'Name must be a String').isString().optional(),
    check('category', 'Mongo ID not valid')
      .isMongoId()
      .custom(existCategory)
      .optional(),
    check('avaliable', 'Avaliable must be a boolean').isBoolean().optional(),
    check('description', 'Description must be a String').isString().optional(),
    check('price', 'Price must be a Number').isNumeric().optional(),
    validateFields,
  ],
  updateProduct
)

router.delete(
  '/:id',
  [
    validateJWT,
    validateAdminRole,
    check('id', 'Id not valid').isMongoId(),
    check('id').custom(existProduct),
    validateFields,
  ],
  deleteProduct
)

module.exports = router
