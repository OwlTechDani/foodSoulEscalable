const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncRoute = require('../helpers/async');
const auth = asyncRoute(async (req, res, next) => {
  let payload;
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ') || !header.slice(7)) return res.status(401).json({ error: 'Inicia sesión para continuar' });
  try { payload = jwt.verify(header.slice(7), process.env.JWT_SECRET, { algorithms: ['HS256'] }); }
  catch { return res.status(401).json({ error: 'Inicia sesión para continuar' }); }
  const user = await User.findById(payload.sub).select('+sessionVersion');
  if (!user || !user.active || user.sessionVersion !== payload.version || user.role !== payload.role) return res.status(401).json({ error: 'La sesión ya no está disponible' });
  req.user = user;
  next();
});
function admin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede realizar esta acción' });
  next();
}
module.exports = { auth, admin };
