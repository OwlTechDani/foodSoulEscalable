import cors from 'cors';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import type { Server as HttpServer } from 'node:http';
import adminRoutes from '../routes/admin';
import authRoutes from '../routes/auth';
import recipesRoutes from '../routes/recipes';

interface HttpError {
  type?: string;
  code?: number;
}

export class Server {
  app: Express;
  port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
    this.app.use(express.json());

    this.routes();
    this.app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      if (err.type === 'entity.parse.failed') {
        res.status(400).json({ error: 'El cuerpo debe ser JSON válido' });
        return;
      }
      if (err.type === 'entity.too.large') {
        res.status(413).json({ error: 'La receta es demasiado grande' });
        return;
      }
      if (err.code === 11000) {
        res.status(409).json({ error: 'El correo o elemento ya existe' });
        return;
      }
      console.error(err);
      res.status(500).json({ error: 'No se pudo procesar la petición' });
    });
  }

  routes(): void {
    this.app.get('/api/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    this.app.use('/api/recipes', recipesRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/admin', adminRoutes);

    this.app.use((_req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });
  }

  listen(): HttpServer {
    return this.app.listen(this.port, 'localhost', () => {
      console.log(`Food For My Soul API escuchando en http://localhost:${this.port}`);
    });
  }
}

export default Server;
