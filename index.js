const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/indexRoute.js');

//Configuración y Modelos de Bases de Datos
const db = require('./config/db.js');
require('./models/usuariosModel.js');
db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));

//Variables de Desarrollo
require('dotenv').config({ path: '.env' });
const port = process.env.PORT;

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

//Definiendo un Middleware propio para Usuario, fecha y mensajes
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

app.use('/', router());


app.listen(port, () => {
  console.log(`El Servidor está funcionando en el puerto: ${port}`);
});