const { response } = require('express')
const { isValidObjectId } = require('mongoose')
const { User, Category, Product } = require('../models')

const validCollections = ['users', 'categories', 'products', 'roles']

const searchUsers = async (term = '', res = response) => {
  const isMongoID = isValidObjectId(term)
  if (isMongoID) {
    const user = await User.find({ _id: term, state: true })
    return res.json({
      results: user ? [user] : [],
    })
  }
  const regex = new RegExp(term, 'i')
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  })
  res.json({ results: users })
}

const searchCategories = async (term = '', res = response) => {
  const isMongoID = isValidObjectId(term)
  if (isMongoID) {
    const category = await Category.find({ _id: term, state: true }).populate(
      'user',
      'name'
    )
    return res.json({
      results: category ? [category] : [],
    })
  }
  const regex = new RegExp(term, 'i')
  const category = await Category.find({ name: regex, state: true }).populate(
    'user',
    'name'
  )
  res.json({ results: category })
}

const searchProducts = async (term = '', res = response) => {
  const isMongoID = isValidObjectId(term)
  if (isMongoID) {
    const product = await Product.find({ _id: term, state: true })
      .populate('category', 'name')
      .populate('user', 'name')
    return res.json({
      results: product ? [product] : [],
    })
  }
  const regex = new RegExp(term, 'i')
  const products = await Product.find({ name: regex, state: true })
    .populate('category', 'name')
    .populate('user', 'name')

  res.json({ results: products })
}

const search = (req, res = response) => {
  const { collection, term } = req.params
  if (!validCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The collection '${collection}' does not exist, try with '${validCollections}'`,
    })
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res)
      break
    case 'categories':
      searchCategories(term, res)
      break
    case 'products':
      searchProducts(term, res)
      break
    default:
      res.status(500).json({
        msg: 'You forgot how to do the search :P',
      })
  }
}

module.exports = {
  search,
}
