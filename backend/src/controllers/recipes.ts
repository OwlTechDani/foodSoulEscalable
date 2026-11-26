import type { Request, Response } from 'express';
import type { PipelineStage } from 'mongoose';
import Catalog from '../models/catalog';
import Recipe, { type RecipeDocument } from '../models/recipe';
import type { UserDocument } from '../models/user';

interface RecipeInput {
  title: string;
  description: string;
  category: string;
  recipeType: string;
  tags: string[];
  prepMinutes: number;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

async function validateRecipe(body: Record<string, unknown>): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};

  for (const [field, min] of [
    ['title', 3],
    ['description', 10],
  ] as const) {
    const value = body[field];
    if (typeof value !== 'string' || value.trim().length < min) {
      errors[field] = `Escribe al menos ${min} caracteres.`;
    }
  }

  if (
    typeof body.category !== 'string' ||
    !(await Catalog.exists({ kind: 'category', name: body.category }))
  ) {
    errors.category = 'Selecciona una categoría disponible.';
  }

  if (
    typeof body.prepMinutes !== 'number' ||
    !Number.isInteger(body.prepMinutes) ||
    body.prepMinutes < 1 ||
    body.prepMinutes > 1440
  ) {
    errors.prepMinutes = 'Indica un número entero entre 1 y 1440.';
  }

  for (const field of ['ingredients', 'steps'] as const) {
    const value = body[field];
    if (
      !Array.isArray(value) ||
      !value.length ||
      value.some((item) => typeof item !== 'string' || !item.trim())
    ) {
      errors[field] = 'Agrega al menos una línea de texto válida.';
    }
  }

  if (body.imageUrl !== undefined && body.imageUrl !== '') {
    if (typeof body.imageUrl !== 'string') {
      errors.imageUrl = 'Usa una dirección http o https válida.';
    } else {
      try {
        const url = new URL(body.imageUrl);
        if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
          errors.imageUrl = 'Usa una dirección http o https válida.';
        }
      } catch {
        errors.imageUrl = 'Usa una dirección http o https válida.';
      }
    }
  }

  if (
    typeof body.recipeType !== 'string' ||
    !(await Catalog.exists({ kind: 'type', name: body.recipeType }))
  ) {
    errors.recipeType = 'Selecciona un tipo disponible.';
  }

  if (!isStringArray(body.tags) || body.tags.length > 20) {
    errors.tags = 'Selecciona etiquetas disponibles.';
  } else if (
    (await Catalog.countDocuments({ kind: 'tag', name: { $in: body.tags } })) !==
    new Set(body.tags).size
  ) {
    errors.tags = 'Selecciona etiquetas disponibles.';
  }

  if (typeof body.title === 'string' && body.title.length > 120) {
    errors.title = 'Máximo 120 caracteres.';
  }

  return errors;
}

function recipeData(body: RecipeInput): RecipeInput {
  return {
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category.trim(),
    recipeType: body.recipeType,
    tags: [...new Set(body.tags)],
    prepMinutes: body.prepMinutes,
    imageUrl: body.imageUrl ? new URL(body.imageUrl).href : '',
    ingredients: body.ingredients.map((item) => item.trim()),
    steps: body.steps.map((item) => item.trim()),
  };
}

function canManage(user: UserDocument, owner?: string | null): boolean {
  return user.role === 'admin' || user.id === owner;
}

async function findAuthorizedRecipe(
  req: Request,
  res: Response,
  forbiddenError: string,
): Promise<RecipeDocument | null> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return null;
  }
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: 'No se encontró la receta' });
    return null;
  }
  if (!canManage(req.user, recipe.owner)) {
    res.status(403).json({ error: forbiddenError });
    return null;
  }
  return recipe;
}

async function findAuthorizedComment(
  req: Request,
  res: Response,
  forbiddenError: string,
): Promise<{
  recipe: RecipeDocument;
  comment: NonNullable<ReturnType<RecipeDocument['comments']['id']>>;
} | null> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return null;
  }
  const recipe = await Recipe.findById(req.params.id);
  const comment = recipe?.comments.id(req.params.commentId);
  if (!recipe || !comment) {
    res.status(404).json({ error: 'No se encontró el comentario' });
    return null;
  }
  if (!canManage(req.user, comment.owner)) {
    res.status(403).json({ error: forbiddenError });
    return null;
  }
  return { recipe, comment };
}

export async function getRecipes(req: Request, res: Response): Promise<void> {
  const filter: Record<string, unknown> = {};
  const queryFields = [
    ['category', 'category'],
    ['type', 'recipeType'],
    ['tag', 'tags'],
    ['owner', 'owner'],
  ] as const;

  for (const [query, field] of queryFields) {
    const value = req.query[query];
    if (typeof value === 'string' && value) {
      filter[field] = value;
    }
  }

  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    const text = Array.from(req.query.q.trim(), (char) =>
      '.*+?^${}()|[]\\'.includes(char) ? `\\${char}` : char,
    ).join('');
    filter.title = { $regex: text, $options: 'i' };
  }

  const rawPage = req.query.page;
  const rawLimit = req.query.limit;
  const rawSort = req.query.sort;
  if (rawSort !== undefined && (typeof rawSort !== 'string' || !['recent', 'popular'].includes(rawSort))) {
    res.status(400).json({ error: 'El orden debe ser recent o popular' });
    return;
  }
  const paginated = rawPage !== undefined || rawLimit !== undefined;
  const page = Number(rawPage ?? 1);
  const limit = Number(rawLimit ?? 6);
  if (
    paginated &&
    ((rawPage !== undefined && typeof rawPage !== 'string') ||
      (rawLimit !== undefined && typeof rawLimit !== 'string') ||
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100 ||
      !Number.isSafeInteger((page - 1) * limit))
  ) {
    res.status(400).json({ error: 'Página entera desde 1 y límite entero entre 1 y 100' });
    return;
  }

  const countPromise = paginated ? Recipe.countDocuments(filter) : Promise.resolve(0);
  let data: unknown[];
  let total: number;
  if (rawSort === 'popular') {
    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $addFields: { likesCount: { $size: { $ifNull: ['$likes', []] } } } },
      { $sort: { likesCount: -1, createdAt: -1, _id: -1 } },
      ...(paginated ? [{ $skip: (page - 1) * limit }, { $limit: limit }] : []),
      { $addFields: { id: '$_id' } },
      { $project: { comments: 0, likesCount: 0 } },
    ];
    [data, total] = await Promise.all([Recipe.aggregate(pipeline), countPromise]);
  } else {
    const query = Recipe.find(filter).sort({ createdAt: -1, _id: -1 }).select('-comments');
    [data, total] = await Promise.all([
      paginated ? query.skip((page - 1) * limit).limit(limit) : query,
      countPromise,
    ]);
  }

  if (!paginated) {
    res.json({ data });
    return;
  }
  res.json({
    data,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function getRecipeById(req: Request, res: Response): Promise<void> {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: 'No se encontró la receta' });
    return;
  }
  res.json({ data: recipe });
}

export async function createRecipe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const errors = await validateRecipe(body);
  if (Object.keys(errors).length) {
    res.status(400).json({ error: 'Revisa los campos indicados', errors });
    return;
  }

  const created = await Recipe.create({
    ...recipeData(body as unknown as RecipeInput),
    owner: req.user.id,
    author: req.user.name,
  });
  res.status(201).json({ data: created });
}

export async function updateRecipe(req: Request, res: Response): Promise<void> {
  const recipe = await findAuthorizedRecipe(
    req,
    res,
    'Solo puedes editar tus propias recetas',
  );
  if (!recipe) return;

  const body = (req.body ?? {}) as Record<string, unknown>;
  const errors = await validateRecipe(body);
  if (Object.keys(errors).length) {
    res.status(400).json({ error: 'Revisa los campos indicados', errors });
    return;
  }

  Object.assign(recipe, recipeData(body as unknown as RecipeInput));
  await recipe.save();
  res.json({ data: recipe });
}

export async function deleteRecipe(req: Request, res: Response): Promise<void> {
  const recipe = await findAuthorizedRecipe(
    req,
    res,
    'Solo puedes eliminar tus propias recetas',
  );
  if (!recipe) return;

  await recipe.deleteOne();
  res.status(204).send();
}

export async function setLike(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }
  const update =
    req.method === 'PUT'
      ? { $addToSet: { likes: req.user.id } }
      : { $pull: { likes: req.user.id } };
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, update, {
    returnDocument: 'after',
  }).select('likes');
  if (!recipe) {
    res.status(404).json({ error: 'No se encontró la receta' });
    return;
  }
  res.json({ data: recipe.likes });
}

export async function addComment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Inicia sesión para continuar' });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (typeof body.text !== 'string' || !body.text.trim() || body.text.length > 2000) {
    res.status(400).json({ error: 'Escribe un comentario de 1 a 2000 caracteres' });
    return;
  }

  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          owner: req.user.id,
          author: req.user.name,
          text: body.text.trim(),
        },
      },
    },
    { returnDocument: 'after' },
  );
  if (!recipe) {
    res.status(404).json({ error: 'No se encontró la receta' });
    return;
  }
  res.status(201).json({ data: recipe.comments });
}

export async function updateComment(req: Request, res: Response): Promise<void> {
  const found = await findAuthorizedComment(
    req,
    res,
    'Solo puedes modificar tus comentarios',
  );
  if (!found) return;

  const body = (req.body ?? {}) as Record<string, unknown>;
  if (typeof body.text !== 'string' || !body.text.trim() || body.text.length > 2000) {
    res.status(400).json({ error: 'Escribe un comentario de 1 a 2000 caracteres' });
    return;
  }

  await Recipe.updateOne(
    { _id: found.recipe.id, 'comments._id': found.comment._id },
    { $set: { 'comments.$.text': body.text.trim() } },
  );
  res.status(204).send();
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  const found = await findAuthorizedComment(
    req,
    res,
    'Solo puedes eliminar tus comentarios',
  );
  if (!found) return;

  await Recipe.updateOne(
    { _id: found.recipe.id },
    { $pull: { comments: { _id: found.comment._id } } },
  );
  res.status(204).send();
}
