import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connect from '../database/config';
import User from '../models/user';

dotenv.config();

(async () => {
  const email = process.argv[2];
  if (!email) {
    throw new Error('Uso: npm run admin -- correo');
  }
  await connect();
  const user = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { role: 'admin' },
  );
  if (!user) {
    throw new Error('Registra primero esa cuenta desde la aplicación');
  }
  console.log('Permiso de administrador asignado');
})()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
