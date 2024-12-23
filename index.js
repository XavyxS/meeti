const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport.js');
const router = require('./routes/indexRoute.js');

//Configuración y Modelos de Bases de Datos
const db = require('./config/db.js');
require('./models/usuariosModel.js');
db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));

//Variables de Desarrollo
require('dotenv').config({ path: '.env' });

//Aplicación Principal
const app = express();

//BodyParser para leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Habilitar EJS como Template Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Definir el directorio de las vistas
app.set('views', path.join(__dirname, './views'));

//Definir el directorio de Archivos Estáticos
app.use(express.static('public'));

//Habilitar cookie-paser
app.use(cookieParser());

//Habilitar Express-Validator (validación con múltiples funciones)
app.use(expressValidator());

// Crear la sesión
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,              // Asegúrate de que esto sea `true` si usas HTTPS
    maxAge: 1000 * 60 * 60 * 24 // Tiempo de expiración de la cookie en milisegundos (por ejemplo, 24 horas)
  }
}));

//Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Agregar flash message
app.use(flash());

//Definiendo un Middleware propio para Usuario, fecha y mensajes
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

app.use('/', router());

const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`El Servidor está funcionando en el puerto: ${port}`);
});