const Sequelize = require("sequelize");
require('dotenv').config({ path: '.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  define: {
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Acepta certificados SSL auto-firmados
    },
  },
});

module.exports = sequelize;
