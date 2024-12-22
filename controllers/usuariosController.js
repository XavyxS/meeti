const Usuarios = require('../models/usuariosModel');

exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    pagina: 'Crea tu Cuenta'
  });
};

exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;

  req.checkBody('confirmar', 'La confirmación del Password no puede ir vacía').notEmpty();
  req.checkBody('confirmar', 'La confirmación del Password es diferente').equals(req.body.password);
  //Leer los errores de Express
  const erroresExpress = req.validationErrors();

  try {
    const nuevoUsuario = await Usuarios.create(usuario);

    //Flash Message y redireccionar
    req.flash('exito', 'Te hemos enviado un Email, confirma tu cuenta');
    res.redirect('/iniciar-sesion');

  } catch (error) {
    //Obtenemos los 'messages' de los errores de Sequelize
    const erroresSeq = error.errors.map(err => err.message);

    //Obtenemos los 'msg' de los errores de Express-Validator
    const errExpress = erroresExpress.map(err => err.msg);

    //Unir los dos arreglos
    const listaErrores = [...erroresSeq, ...errExpress];


    req.flash('error', listaErrores); //Creameos el mensajes con el key 'error' y le pasameos el conjunto de errores
    res.redirect('/crear-cuenta'); //Regresamos al usuarioa al formulario para mostrarle los errores
  }
};

exports.formIniciarSesion = (req, res) => {
  res.render('iniciar-sesion', {
    pagina: 'Iniciar Sesión'
  });
};
