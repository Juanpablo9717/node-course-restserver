const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
  const query = req.query;


  res.json({
    msg: 'get API - Controller',
    query
  });
};

const usersPost = (req, res) => {

  const {name, age} = req.body;
  res.json({
    msg: 'post API - Controller',
    name,
    age,
  });
};

const usersPut = (req, res) => {

  const id = req.params.id;
  res.json({
    msg: 'put API - Controller',
    id
  });
};

const usersDelete = (req, res) => {
  res.json({
    msg: 'delete API - Controller',
  });
};

const usersPatch = (req, res) => {
  res.json({
    msg: 'patch API',
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
};
