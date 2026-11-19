const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');
const comment = new mongoose.Schema({
  _id: { type: String, default: randomUUID }, owner: String, author: String,
  text: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true, versionKey: false } });
module.exports = mongoose.model('Recipe', new mongoose.Schema({
  _id: { type: String, default: randomUUID },
  title: String, description: String, imageUrl: String, owner: String, author: String,
  category: String, recipeType: String, tags: [String], prepMinutes: Number,
  ingredients: [String], steps: [String], comments: [comment], likes: [String],
}, { timestamps: true, toJSON: { virtuals: true, versionKey: false } }));
