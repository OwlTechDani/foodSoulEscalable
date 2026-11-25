import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import asyncRoute from '../helpers/async';
import User from '../models/user';

function hasTokenClaims(
  payload: string | JwtPayload,
): payload is JwtPayload & { sub: string; version: number; role: string } {
  return (
    typeof payload !== 'string' &&
    typeof payload.sub === 'string' &&
    typeof payload.version === 'number' &&
    typeof payload.role === 'string'
  );
}

export const auth = asyncRoute(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ') || !header.slice(7)) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Configuración de autenticación incompleta' });
    return;
  }

  let payload: string | JwtPayload;
  try {
    payload = jwt.verify(header.slice(7), secret, { algorithms: ['HS256'] });
  } catch {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }

  if (!hasTokenClaims(payload)) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }

  const user = await User.findById(payload.sub).select('+sessionVersion');
  if (
    !user ||
    !user.active ||
    user.sessionVersion !== payload.version ||
    user.role !== payload.role
  ) {
    res.status(401).json({ error: 'La sesión ya no está disponible' });
    return;
  }

  req.user = user;
  next();
});

export function admin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Solo el administrador puede realizar esta acción' });
    return;
  }
  next();
}
