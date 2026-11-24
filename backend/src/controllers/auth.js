const User = require('../models/user');
const jwt = require('jsonwebtoken');
const password = require('../helpers/password');
function account(user) { return { id: user.id, name: user.name, email: user.email, role: user.role }; }
function session(user) {
  return { user: account(user), token: jwt.sign({ role: user.role, version: user.sessionVersion || 0 }, process.env.JWT_SECRET, { subject: user.id, algorithm: 'HS256', expiresIn: '8h' }) };
}
async function register(req, res) {
  const { name, email, password: plain } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 80 || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof plain !== 'string' || plain.length < 8 || plain.length > 128) return res.status(400).json({ error: 'Indica nombre, correo válido y contraseña de 8 a 128 caracteres' });
  const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await password.hash(plain) });
  res.status(201).json(session(user));
}
async function login(req, res) {
  const { email, password: plain } = req.body || {};
  if (typeof email !== 'string' || typeof plain !== 'string' || plain.length > 128) return res.status(400).json({ error: 'Indica tu correo y contraseña' });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +sessionVersion');
  if (!user || !user.active || !await password.verify(plain, user.password)) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  res.json(session(user));
}
async function logout(req, res) { await User.updateOne({ _id: req.user.id }, { $inc: { sessionVersion: 1 } }); res.status(204).send(); }
module.exports = { register, login, logout, account };
