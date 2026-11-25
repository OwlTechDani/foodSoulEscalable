import { Router } from 'express';
import { account, login, logout, register } from '../controllers/auth';
import asyncRoute from '../helpers/async';
import { auth } from '../middleware/auth';

const router = Router();
let attempts = 0;
let resetAt = Date.now() + 60_000;

router.use((req, res, next) => {
  if (req.method !== 'POST' || !['/login', '/register'].includes(req.path)) {
    next();
    return;
  }
  if (Date.now() >= resetAt) {
    attempts = 0;
    resetAt = Date.now() + 60_000;
  }
  if (++attempts > 30) {
    res
      .status(429)
      .set('Retry-After', '60')
      .json({ error: 'Espera un minuto antes de volver a intentar' });
    return;
  }
  next();
});

router.post('/register', asyncRoute(register));
router.post('/login', asyncRoute(login));
router.post('/logout', auth, asyncRoute(logout));
router.get('/me', auth, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }
  res.json({ user: account(req.user) });
});

export default router;
