const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController.js');
const usuariosController = require('../controllers/usuariosController.js');
const authController = require('../controllers/authController.js');

module.exports = function () {
  router.get('/', homeController.home);

  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);

  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  router.get('/confirmar-cuenta/:email', usuariosController.confirmarCuenta)

  return router;
};