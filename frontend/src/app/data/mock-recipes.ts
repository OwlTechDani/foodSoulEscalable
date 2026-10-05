import { Recipe } from '../models/recipe.interface';

// MOCK de respaldo para que la interfaz se pueda revisar si Express está apagado.
export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1', title: 'Tostadas de aguacate y huevo',
    description: 'Una opción sencilla para un desayuno completo.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    author: 'Cocina de prueba', category: 'Desayuno', prepMinutes: 15,
    ingredients: ['2 rebanadas de pan', '1 aguacate', '2 huevos', 'Limón y sal al gusto'],
    steps: ['Tuesta el pan.', 'Machaca el aguacate con limón y sal.', 'Cocina los huevos y sirve sobre el pan.'],
  },
  {
    id: '2', title: 'Pasta cremosa con tomate',
    description: 'Pasta de diario con una salsa rápida de tomate y yogur.',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=80',
    author: 'Cocina de prueba', category: 'Comida', prepMinutes: 25,
    ingredients: ['200 g de pasta', '2 tomates', '1 diente de ajo', '2 cucharadas de yogur natural'],
    steps: ['Cuece la pasta según el empaque.', 'Cocina el tomate y el ajo en una sartén.', 'Mezcla la salsa, el yogur y la pasta.'],
  },
  {
    id: '3', title: 'Ensalada de garbanzo y pepino',
    description: 'Una ensalada fresca que se prepara con ingredientes básicos.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    author: 'Cocina de prueba', category: 'Vegetariana', prepMinutes: 10,
    ingredients: ['1 taza de garbanzos cocidos', '1 pepino', '1 tomate', 'Limón y aceite de oliva'],
    steps: ['Corta el pepino y el tomate.', 'Mezcla con los garbanzos.', 'Agrega limón, aceite y mezcla.'],
  },
];
