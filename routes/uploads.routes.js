const { Router } = require('express')
const { check } = require('express-validator')
const { uploadFile, showImage, updateImageCloudinary } = require('../controllers/uploads.controller')
const { collectionsAllowed } = require('../helpers')
const { validateFields, valideUploadFile } = require('../middlewares')

const router = Router()

router.post('/', [valideUploadFile], uploadFile)

router.put(
  '/:collection/:id',
  [
    valideUploadFile,
    check('id', 'ID would be a Mongo ID').isMongoId(),
    check('collection').custom((col) =>
      collectionsAllowed(col, ['users', 'products'])
    ),
    validateFields,
  ],
  updateImageCloudinary
  // updateImage
)

router.get('/:collection/:id', [
  check('id', 'ID would be a Mongo ID').isMongoId(),
  check('collection').custom((col) =>
    collectionsAllowed(col, ['users', 'products'])
  ),
  validateFields,
], showImage)

module.exports = router
