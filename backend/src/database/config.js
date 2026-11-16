const mongoose = require('mongoose');
const Catalog = require('../models/catalog');
async function connect() {
  if (!process.env.MONGODB_URI) throw new Error('Configura MONGODB_URI en backend/.env');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await Promise.all([require('../models/user').init(), Catalog.init()]);
  if (!await Catalog.exists({})) {
    await Catalog.insertMany([
      ...['Desayuno', 'Comida', 'Vegetariana', 'Cena', 'Postre'].map(name => ({ kind: 'category', name })),
      { kind: 'type', name: 'Plato principal' }, { kind: 'type', name: 'Acompañamiento' },
      { kind: 'tag', name: 'Fácil' }, { kind: 'tag', name: 'Rápida' },
    ]);
  }
}
module.exports = connect;
