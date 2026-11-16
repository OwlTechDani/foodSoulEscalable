const router = require('express').Router();
const { register, login, logout, account } = require('../controllers/auth');
const asyncRoute = require('../helpers/async');
const { auth } = require('../middleware/auth');
let attempts = 0;
let resetAt = Date.now() + 60000;
router.use((req, res, next) => {
  if (req.method !== 'POST' || !['/login', '/register'].includes(req.path)) return next();
  if (Date.now() >= resetAt) { attempts = 0; resetAt = Date.now() + 60000; }
  if (++attempts > 30) return res.status(429).set('Retry-After', '60').json({ error: 'Espera un minuto antes de volver a intentar' });
  next();
});
router.post('/register', asyncRoute(register));
router.post('/login', asyncRoute(login));
router.post('/logout', auth, asyncRoute(logout));
router.get('/me', auth, (req, res) => res.json({ user: account(req.user) }));
module.exports = router;
