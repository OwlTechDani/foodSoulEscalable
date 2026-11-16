const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');
module.exports = mongoose.model('User', new mongoose.Schema({
  _id: { type: String, default: randomUUID },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  active: { type: Boolean, default: true },
  sessionVersion: { type: Number, default: 0, select: false },
}, { toJSON: { virtuals: true, versionKey: false } }));
