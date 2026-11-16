require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../database/config');
const User = require('../models/user');
(async () => {
  if (!process.argv[2]) throw new Error('Uso: npm run admin -- correo');
  await connect();
  const user = await User.findOneAndUpdate({ email: process.argv[2].trim().toLowerCase() }, { role: 'admin' });
  if (!user) throw new Error('Registra primero esa cuenta desde la aplicación');
  console.log('Permiso de administrador asignado');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
