const Usuarios = require('../models/usuariosModel');

exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    pagina: 'Crea tu Cuenta'
  });
};

exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;
  try {
    const nuevoUsuario = await Usuarios.create(usuario);
    console.log('Usuario Creado', nuevoUsuario);
    
  } catch (error) {
    console.log(error);
  }
};