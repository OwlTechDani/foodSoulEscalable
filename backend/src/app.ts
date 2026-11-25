import dotenv from 'dotenv';
import connect from './database/config';
import Server from './models/server';

dotenv.config();

connect()
  .then(() => new Server().listen())
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
