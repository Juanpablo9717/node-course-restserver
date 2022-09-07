
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({

  rol: {
    type: String,
    required: [true, 'The rol is required']
  }
});

module.exports = model('Role', RoleSchema);

// El nombre del modelo que se va a exportar debe ser el nombre en singular que se creo en el modelo
// Por ejemplo, en este caso el modelo se llama 'Role', tambien puede llamarse 'role'
// Este nombre debe ser exactamente ese ya que la coleccion en la base de datos se llama 'roles'

// Si la coleccion en la base de datos se llama 'users' el modelo debe ser 'user'

// Nota: si el modelo exportado no tiene un documento en la base de datos con un nombre 
// similar, este lo creara segun el nombre de el modelo, por ejemplo:
//
// si exportamos el modelo 'user' y en la base de datos no existe un documento llamado:
// 'Users' este se creara de manera automatica