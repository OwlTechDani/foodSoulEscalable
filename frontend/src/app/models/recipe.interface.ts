export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  owner: string;
  recipeType: string;
  tags: string[];
  likes?: string[];
  comments?: RecipeComment[];
  category: string;
  prepMinutes: number;
  ingredients: string[];
  steps: string[];
}

export type RecipeInput = Omit<Recipe, 'id' | 'author' | 'owner' | 'comments' | 'likes'>;
export interface RecipeComment { id: string; owner: string; author: string; text: string; }
