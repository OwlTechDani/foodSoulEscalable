const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncRoute = require('../helpers/async');
const auth = asyncRoute(async (req, res, next) => {
  let payload;
  try { payload = jwt.verify((req.headers.authorization || '').replace(/^Bearer /, ''), process.env.JWT_SECRET, { algorithms: ['HS256'] }); }
  catch { return res.status(401).json({ error: 'Inicia sesión para continuar' }); }
  const user = await User.findById(payload.sub).select('+sessionVersion');
  if (!user || !user.active || user.sessionVersion !== payload.version) return res.status(401).json({ error: 'La sesión ya no está disponible' });
  req.user = user;
  next();
});
function admin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede realizar esta acción' });
  next();
}
module.exports = { auth, admin };
