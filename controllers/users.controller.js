const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/users.schema');

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  // const users = await User.find({state: true})
  //   .skip(Number(from))
  //   .limit(Number(limit));
  
  // const total = await User.countDocuments({state: true});

  // Este codigo comentado es bloqueando, significa que cuando se ejecuta el controlador
  // este espera la respues de cada await para seguir con la otra consulta

  // esto se resuelve con Primise.all(); ya que la primer respuesta no depende de la segunda


  const [ total, users ] = await Promise.all([
    User.countDocuments({state: true}),
    User.find({state: true})
    .skip(Number(from))
    .limit(Number(limit))
  ])

  res.json({ total, users });
};

const usersPost = async (req, res) => {
  const { name, email, password, rol } = req.body;
  const user = new User({ name, email, password, rol });

  // Encrypt the password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save user in DB
  await user.save();

  res.json(user);
};

const usersPut = async (req, res) => {
  const id = req.params.id;
  const { _id, password, google, ...rest } = req.body;

  if (password) {
    // Encrypt the password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  // busca el id en la bse de datos y lo actualiza con los datos entrantes

  const user = await User.findByIdAndUpdate(id, rest, { new: true });

  res.json(user);
};

const usersDelete = async (req, res) => {
  const id = req.params.id;

  const user = await User.findByIdAndUpdate(id, {state: false}, { new: true});
  // Existe un metodo findByIdAndDelete pero este elimina fisicamente el elemento de la bse de datos
  // Con este metodo actualizamos el elemento y no lo eliminamos, solo cambiamos la visibilidad

  res.json(user);
};

const usersPatch = async (req, res) => {
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
