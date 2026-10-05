export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  category: string;
  prepMinutes: number;
  ingredients: string[];
  steps: string[];
}
