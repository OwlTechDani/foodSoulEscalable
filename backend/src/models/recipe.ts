import { Schema, model, type HydratedDocumentFromSchema } from 'mongoose';
import { randomUUID } from 'node:crypto';

const commentSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    owner: String,
    author: String,
    text: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false } },
);

const recipeSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    title: String,
    description: String,
    imageUrl: String,
    owner: String,
    author: String,
    category: String,
    recipeType: String,
    tags: [String],
    prepMinutes: Number,
    ingredients: [String],
    steps: [String],
    comments: [commentSchema],
    likes: [String],
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false } },
);

export type RecipeDocument = HydratedDocumentFromSchema<typeof recipeSchema>;

export const Recipe = model('Recipe', recipeSchema);

export default Recipe;
