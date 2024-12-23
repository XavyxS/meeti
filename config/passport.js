const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/usuariosModel');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async (email, password, done) => {
    //Este código se ejecuta como un middleware al llenar el formaulario
    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) return done(null, false,
      { message: 'El usuario no existe' });

    //Checamos que el password existe
    const verificaPass = usuario.validarPassword(password);
    if (!verificaPass) return done(null, false,
      { message: 'El password es incorrecto' });

    //Todo bien
    return done(null, usuario);
  }
));

passport.serializeUser(function (usuario, cb) {
  cb(null, usuario);
});

passport.deserializeUser(function (usuario, cb) {
  cb(null, usuario);
});

module.exports = passport;
