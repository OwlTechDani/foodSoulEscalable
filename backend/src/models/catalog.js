const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');
const schema = new mongoose.Schema({
  _id: { type: String, default: randomUUID },
  kind: { type: String, enum: ['category', 'tag', 'type'], required: true },
  name: { type: String, required: true },
}, { toJSON: { virtuals: true, versionKey: false } });
schema.index({ kind: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Catalog', schema);
