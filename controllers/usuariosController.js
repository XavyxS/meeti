const Usuarios = require('../models/usuariosModel');
const enviarEmail = require('../handlers/emails.js');
const { where } = require('sequelize');

exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    pagina: 'Crea tu Cuenta'
  });
};

exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;

  //Vamos a checar que los dos campos de Password sean iguales
  req.checkBody('confirmar', 'La confirmación del Password no puede ir vacía').notEmpty();
  req.checkBody('confirmar', 'La confirmación del Password es diferente').equals(req.body.password);
  //Leer los errores de Express
  const erroresExpress = req.validationErrors();

  try {
    const nuevoUsuario = await Usuarios.create(usuario);

    //URL de confirmación
    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

    //Enviar email de confirmación
    await enviarEmail.enviarEmail({
      usuario,
      url,
      subject: 'Confirma tu cuenta de Meeti',
      archivo: 'confirmar-cuenta'
    });

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

exports.confirmarCuenta = async (req, res, next) => {

  //Verificar que el email existe en la BD
  const usuario = await Usuarios.findOne({
    where:
      { email: req.params.email }
  });

  if (!usuario) {
    req.flash('error', 'Ese usuario no existe. Crea una cuenta');
    res.redirect('/crear-cuenta');
    return next();
  }

  // si el usuario existe, confirmar suscripción, cambiar el estatus en ls BD y redireccionar a login
  usuario.activo = 1;
  await usuario.save();
  req.flash('exito', 'Tu cuenta ha sido confirmada. Ahora puedes iniciar Sesión');
  return res.redirect('/iniciar-sesion');
};

exports.formIniciarSesion = (req, res) => {
  res.render('iniciar-sesion', {
    pagina: 'Iniciar Sesión'
  });
};

exports.iniciarSesion = async (req, res, next) => {

  //Checar que el usuario exista y que se encuentre activo
  const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

  if (!usuario) {
    req.flash('error', 'Ese email no está resgistrado');
    return res.redirect('/iniciar-sesion');
  }
  //Checamos que ya haya conformado la cuenta
  if (!usuario.activo == 1) {
    req.flash('error', 'Aún no has confirmado tu cuenta. Revisa tu correo');
    return res.redirect('/iniciar-sesion');
  }
  //Checamos que el password se el correcto con nuestra función de bcrypt
  const verificaPass = usuario.validarPassword(usuario.password)
  res.send('BIENVENIDO...');
};


