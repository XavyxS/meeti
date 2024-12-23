const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');
const { send } = require('process');

var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.enviarEmail = async (opciones) => {
  console.log(opciones);

  //Leer el archivo de email
  const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;

  //Compilarlo
  const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'));

  //Crear el HTML
  const html = compilado({ url: opciones.url });

  //Configurar opciones del email
  const opcionesEmail ={
    from: 'Meeti <noreply@meeti.com',
    to: opciones.usuario.email,
    subject: opciones.subject,
    html: html
  }

  //Enviar email
  const sendEmail = util.promisify(transport.sendMail, transport)
  return sendEmail.call(transport, opcionesEmail)
};