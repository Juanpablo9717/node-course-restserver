const { request, response } = require('express')
const { Product } = require('../models')

// Create Product
const createProduct = async (req = request, res = response) => {
  try {
    const { name, price, category } = req.body
    const productDb = await Product.findOne({ name: name.toUpperCase() })

    if (productDb) {
      return res.status(400).json({
        msg: `Product ${productDb.name} already exists.`,
      })
    }

    const data = {
      name: name.toUpperCase(),
      user: req.user._id,
      price,
      category,
    }
    const product = new Product(data)
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.log('Error creating product: ', error)
  }
}

// Get all products
const getProducts = async (req = request, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query

    const [total, products] = await Promise.all([
      Product.countDocuments({ state: true }),
      Product.find({ state: true })
        .populate('category', 'name')
        .populate('user', 'name')
        .skip(Number(from))
        .limit(Number(limit)),
    ])

    res.json({ total, products })
  } catch (error) {
    console.log('Error getting products: ', error)
  }
}

// Get product by ID
const getProduct = async (req = request, res = response) => {
  try {
    const id = req.params.id

    const productDB = await Product.findById(id)
      .populate('category', 'name')
      .populate('user', 'name')

    res.status(200).json(productDB)
  } catch (error) {
    console.log('Error getting product by ID: ', error)
  }
}

// Update Product
const updateProduct = async (req = require, res = response) => {
  try {
    const id = req.params.id
    const { name, category, avaliable, description, price } = req.body

    const data = {
      id,
      user: req.user._id,
      name,
      price,
      category,
      avaliable,
      description,
    }
    if (data.name) {
      data.name = data.name.toUpperCase()
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true })

    res.status(201).json(product)
  } catch (error) {
    console.log('Error updating product', error)
  }
}

// Delete product
const deleteProduct = async (req = request, res = response) => {
  try {
    const id = req.params.id
    const product = await Product.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    )
    res.status(201).json(product)
  } catch (error) {
    console.log('Error deleting product', error)
  }
}

module.exports = {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}
