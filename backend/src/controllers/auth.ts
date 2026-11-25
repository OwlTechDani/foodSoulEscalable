import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { hash, verify } from '../helpers/password';
import User, { type UserDocument, type UserRole } from '../models/user';

export interface AccountSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSession {
  user: AccountSummary;
  token: string;
}

export function account(user: UserDocument): AccountSummary {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function session(user: UserDocument): AuthSession {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET debe estar configurado');
  }
  return {
    user: account(user),
    token: jwt.sign(
      { role: user.role, version: user.sessionVersion || 0 },
      secret,
      { subject: user.id, algorithm: 'HS256', expiresIn: '8h' },
    ),
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password: plain } = (req.body ?? {}) as Record<string, unknown>;
  if (
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    name.length > 80 ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    typeof plain !== 'string' ||
    plain.length < 8 ||
    plain.length > 128
  ) {
    res.status(400).json({
      error: 'Indica nombre, correo válido y contraseña de 8 a 128 caracteres',
    });
    return;
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: await hash(plain),
  });
  res.status(201).json(session(user));
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password: plain } = (req.body ?? {}) as Record<string, unknown>;
  if (typeof email !== 'string' || typeof plain !== 'string' || plain.length > 128) {
    res.status(400).json({ error: 'Indica tu correo y contraseña' });
    return;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    '+password +sessionVersion',
  );
  if (!user || !user.active || !(await verify(plain, user.password))) {
    res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    return;
  }

  res.json(session(user));
}

export async function logout(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }
  await User.updateOne({ _id: req.user.id }, { $inc: { sessionVersion: 1 } });
  res.status(204).send();
}
