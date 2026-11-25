import { Schema, model, type HydratedDocumentFromSchema } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type CatalogKind = 'category' | 'tag' | 'type';

const catalogSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    kind: { type: String, enum: ['category', 'tag', 'type'], required: true },
    name: { type: String, required: true },
  },
  { toJSON: { virtuals: true, versionKey: false } },
);

catalogSchema.index({ kind: 1, name: 1 }, { unique: true });

export type CatalogDocument = HydratedDocumentFromSchema<typeof catalogSchema>;

export const Catalog = model('Catalog', catalogSchema);

export default Catalog;
