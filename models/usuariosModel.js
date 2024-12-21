const db = require('../config/db.js');
const Sequelize = require("sequelize");
const bcrypt = require('bcrypt');

const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(60),
    allowNull: false
  },
  imagen: Sequelize.STRING(60,),
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
    validate: {
      isEmail: { msg: 'Debes capturar un email válido' }
    },
    unique: {
      args: true,
      msg: 'Ese email ya está registrado'
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El password no debe ir vacío' }
    }
  },
  activo: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  tokenPassword: Sequelize.STRING,
  expiraToken: Sequelize.DATE


},
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10), null);
      }
    }
  }
);

//Método para comparar los password
Usuarios.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Usuarios;
