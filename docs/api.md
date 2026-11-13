# API de recetas

Base: `http://localhost:3000/api`. Datos de demostración en memoria, sin usuarios ni permisos.

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/health` | 200, estado de la API |
| GET | `/recipes` | 200, `{ data: Recipe[] }` |
| GET | `/recipes?q=pasta&category=Comida` | 200, búsqueda por título y categoría combinadas |
| GET | `/recipes/:id` | 200, `{ data: Recipe }`; 404 si no existe |
| POST | `/recipes` | 201, `{ data: Recipe }` |
| PUT | `/recipes/:id` | 200, reemplaza los campos de una receta; 404 si no existe |
| DELETE | `/recipes/:id` | 204 sin cuerpo; 404 si no existe |

POST y PUT reciben JSON con `title`, `description`, `author`, `category`, `prepMinutes`, `ingredients` y `steps`. `imageUrl` es opcional. El identificador lo genera el servidor y no cambia al editar.

Ejemplo:

```json
{
  "title": "Pan con tomate",
  "description": "Una preparación sencilla para compartir.",
  "author": "Cocina local",
  "category": "Cena",
  "prepMinutes": 10,
  "imageUrl": "",
  "ingredients": ["Pan", "Tomate"],
  "steps": ["Cortar el tomate", "Servir sobre el pan"]
}
```

Textos sin espacios vacíos: título mínimo 3, descripción 10, autor y categoría 2 caracteres. Los minutos deben ser enteros entre 1 y 1440. Ingredientes y pasos requieren al menos una cadena no vacía. La imagen debe empezar por http:// o https://.

Campos inválidos: 400 con `{ error, errors }`, donde `errors` relaciona campos con mensajes. JSON mal formado: 400; cuerpo demasiado grande: 413; error inesperado: 500. Las escrituras no generan recetas locales de respaldo si la API falla.

Configuración: `PORT` (3000 por defecto) y `CORS_ORIGIN` (http://localhost:4200 por defecto), mediante dotenv. Referencia en `backend/.env.example`.
