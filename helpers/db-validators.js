const { Category, User, Role, Product } = require('../models');

const isRoleValid = async (rol = '') => {
  const roleExist = await Role.findOne({ rol });
  if (!roleExist) {
    throw new Error(`Role ${rol} not found in DB`);
  }
};

// El parametro rol debe llamarse igual a como se nombro en la base de datos
// {
//   "rol" : "ADMIN_ROLE"
// }

const existEmail = async (email = '') => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`The email '${email}' already exists in DB`);
    // El throw new Error en este caso no revienta la aplicacion, esto lo captura el metodo custom
    // de el paquete de express validation
  }
};
const existUSerById = async (id) => {
  const existUserByID = await User.findById(id);
  if (!existUserByID) {
    throw new Error(`User ID not registered in DB`);
  }
};

const existCategory = async (id) => {
  const existCategory = await Category.findById( id );
  if (!existCategory) {
    throw new Error(`Category ID not found in DB: ${id}`);
  }
}

const existProduct = async (id) => {
  const existProduct = await Product.findById( id );
  if (!existProduct) {
    throw new Error(`Product ID not found in DB: ${id}`);
  }
}

module.exports = {
  isRoleValid,
  existEmail,
  existUSerById,
  existCategory,
  existProduct
};
