const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL )

const { response, request } = require('express')
const { uploadFileHelper } = require('../helpers')
const { Product, User } = require('../models')

const uploadFile = async (req, res = response) => {
  try {
    const name = await uploadFileHelper(req.files, ['jpeg', 'jpg'], 'photos')
    // If I don't want to validate the extension, just send undefined: req.files, undefined, 'folderName'
    res.json({
      name,
    })
  } catch (msg) {
    res.status(400).json({ msg })
  }
}

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params
  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({ msg: `User not found with id ${id}` })
      }
      break

    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.status(400).json({ msg: `Product not found with id ${id}` })
      }
      break

    default:
      return res.status(500).json({ msg: 'I forgot how to validate this :P' })
  }

  // Delete previous image
  if (model.img) {
    // Create local path for img
    const imgPath = path.join(__dirname, '../uploads', collection, model.img)
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath)
    }
  }
  const imgName = await uploadFileHelper(req.files, ['jpeg', 'jpg'], collection)
  model.img = imgName
  await model.save()
  res.json(model)
}

const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params
  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({ msg: `User not found with id ${id}` })
      }
      break

    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.status(400).json({ msg: `Product not found with id ${id}` })
      }
      break

    default:
      return res.status(500).json({ msg: 'I forgot how to validate this :P' })
  }

  // Delete previous image
  if (model.img) {
    const getName = model.img.split('/')    
    const name = getName[getName.length - 1]
    const [ public_id ] = name.split('.');
    cloudinary.uploader.destroy(public_id)
  }
  const {tempFilePath} = req.files.file 
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

  // const imgName = await uploadFileHelper(req.files, ['jpeg', 'jpg'], collection)
  model.img = secure_url
  await model.save()
  res.json(model)
}

const showImage = async (req, res = response) => {
  const { id, collection } = req.params
  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({ msg: `User not found with id ${id}` })
      }
      break

    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.status(400).json({ msg: `Product not found with id ${id}` })
      }
      break

    default:
      return res.status(500).json({ msg: 'I forgot how to validate this :P' })
  }

  // Delete previous image
  if (model.img) {
    // Create local path for img
    const imgPath = path.join(__dirname, '../uploads', collection, model.img)
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath)
    }
  }
  const noImage = path.join(__dirname, '../assets', 'no-image.jpg')
  res.sendFile(noImage)
}

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary
}
