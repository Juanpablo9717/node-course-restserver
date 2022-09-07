const { request, response } = require('express')
const { Category } = require('../models')

const getCategories = async (req = require, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query

    const [total, categories] = await Promise.all([
      Category.countDocuments({ state: true }),
      Category.find({ state: true }).populate('user', 'name').skip(Number(from)).limit(Number(limit)),
    ])

    res.json({ total, categories })
  } catch (error) {
    console.log('Error getting categories: ', error)
  }
}

const getCategory = async (req = require, res = response) => {
  try {
    const id = req.params.id
    const categoryDb = await Category.findById(id)
    res.status(200).json(categoryDb)

  } catch (error) {
    console.log('Error getting category: ', error)
  }
}

const createCategory = async (req = request, res = response) => {
  try {
    const name = req.body.name.toUpperCase()
    const categoryDb = await Category.findOne({ name })

    if (categoryDb) {
      return res.status(400).json({
        msg: `Category ${categoryDb.name} already exists.`,
      })
    }
    // Generate data for save in DB
    const data = {
      name,
      user: req.user._id, // User ID saved when login
    }
    // Create category object for after save
    const category = new Category(data)
    // Save category in DB
    await category.save()

    res.status(201).json(category)
  } catch (error) {
    console.log('Error creating category: ', error)
  }
}

const updateCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params
    const { name } = req.body
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name: name.toUpperCase() },
      { new: true }
    )
    res.status(201).json(category)
  } catch (error) {
    console.log('Error updating category', error)
  }
}

const deleteCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params
    const category = await Category.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    )
    res.status(201).json(category)
  } catch (error) {
    console.log('Error deleting category: ', error)
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
}
