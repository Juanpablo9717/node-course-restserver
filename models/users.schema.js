const { Schema, model } = require('mongoose');

const UserScheme = Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
  },
  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserScheme.methods.toJSON = function() {
  const { __v, password, _id, ...user} = this.toObject();
  return {...user, uid: _id};
}

// Este es un método de mongoose https://mongoosejs.com/docs/api.html#document_Document-toObject

// Convierte el documento(Modelo) en un Objeto de javascript, de esta manera se puede utilizar 
// los métodos o propiedades que se puedan aplicar a un Objeto de javascript.

module.exports = model('User', UserScheme);
