import { Schema, model, type HydratedDocumentFromSchema } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type UserRole = 'user' | 'admin';

const userSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    active: { type: Boolean, default: true },
    sessionVersion: { type: Number, default: 0, select: false },
  },
  { toJSON: { virtuals: true, versionKey: false } },
);

export type UserDocument = HydratedDocumentFromSchema<typeof userSchema>;

export const User = model('User', userSchema);

export default User;
