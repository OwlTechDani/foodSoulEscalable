import type { Request, Response } from 'express';
import Catalog, { type CatalogDocument, type CatalogKind } from '../models/catalog';
import Recipe from '../models/recipe';
import User, { type UserRole } from '../models/user';

const CATALOG_RECIPE_FIELD: Record<CatalogKind, 'category' | 'tags' | 'recipeType'> = {
  category: 'category',
  tag: 'tags',
  type: 'recipeType',
};

function isUserRole(value: unknown): value is UserRole {
  return value === 'user' || value === 'admin';
}

function isCatalogKind(value: unknown): value is CatalogKind {
  return value === 'category' || value === 'tag' || value === 'type';
}

async function isCatalogInUse(item: CatalogDocument): Promise<boolean> {
  const field = CATALOG_RECIPE_FIELD[item.kind];
  return Boolean(await Recipe.exists({ [field]: item.name }));
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  res.json({ data: await User.find().select('name email role active') });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }
  if (req.params.id === req.user.id) {
    res.status(400).json({
      error: 'No puedes cambiar tu propia cuenta desde administración',
    });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  if (typeof body.active !== 'boolean' || !isUserRole(body.role)) {
    res.status(400).json({ error: 'Indica estado y rol válidos' });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: body.active, role: body.role, $inc: { sessionVersion: 1 } },
    { returnDocument: 'after' },
  );
  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  res.json({ data: user });
}

export async function listCatalog(_req: Request, res: Response): Promise<void> {
  res.json({ data: await Catalog.find().sort({ kind: 1, name: 1 }) });
}

export async function saveCatalog(req: Request, res: Response): Promise<void> {
  const { kind, name } = (req.body ?? {}) as Record<string, unknown>;
  if (
    !isCatalogKind(kind) ||
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    name.length > 60
  ) {
    res.status(400).json({ error: 'Indica tipo y nombre de 2 a 60 caracteres' });
    return;
  }

  if (!req.params.id) {
    res.status(201).json({ data: await Catalog.create({ kind, name: name.trim() }) });
    return;
  }

  const item = await Catalog.findById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Elemento no encontrado' });
    return;
  }

  if (await isCatalogInUse(item)) {
    res.status(409).json({
      error: 'El elemento está en uso; cambia primero las recetas que lo utilizan',
    });
    return;
  }

  item.kind = kind;
  item.name = name.trim();
  await item.save();
  res.json({ data: item });
}

export async function deleteCatalog(req: Request, res: Response): Promise<void> {
  const item = await Catalog.findById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Elemento no encontrado' });
    return;
  }

  if (await isCatalogInUse(item)) {
    res.status(409).json({ error: 'El elemento está en uso por una receta' });
    return;
  }

  await item.deleteOne();
  res.status(204).send();
}
