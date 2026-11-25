import mongoose from 'mongoose';
import Catalog from '../models/catalog';
import User from '../models/user';

export async function connect(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Configura MONGODB_URI en backend/.env');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await Promise.all([User.init(), Catalog.init()]);
  if (!(await Catalog.exists({}))) {
    await Catalog.insertMany([
      ...['Desayuno', 'Comida', 'Vegetariana', 'Cena', 'Postre'].map((name) => ({
        kind: 'category' as const,
        name,
      })),
      { kind: 'type' as const, name: 'Plato principal' },
      { kind: 'type' as const, name: 'Acompañamiento' },
      { kind: 'tag' as const, name: 'Fácil' },
      { kind: 'tag' as const, name: 'Rápida' },
    ]);
  }
}

export default connect;
