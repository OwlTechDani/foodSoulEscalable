# API de desarrollo

Base URL local: `http://localhost:3000/api`

Todas las respuestas correctas son JSON. Los registros son mocks guardados en memoria en `backend/src/data/recipes.js`; cualquier cambio se pierde al reiniciar. Por ahora no se aceptan cambios por HTTP.

| Método | Ruta | Respuesta | Estado |
| --- | --- | --- | --- |
| GET | `/health` | `{ "status": "ok" }` | Implementado |
| GET | `/recipes` | `{ "data": Recipe[] }` | Implementado |
| GET | `/recipes/:id` | `{ "data": Recipe }` | Implementado |

Una receta tiene `id`, `title`, `description`, `imageUrl`, `author`, `category`, `prepMinutes`, `ingredients` y `steps`.

## Respuestas de error

- `404` si no existe la receta solicitada o la ruta no está definida.
- `500` si ocurre un error inesperado en el servidor.

## Probar con curl

```bash
curl http://localhost:3000/api/recipes
curl http://localhost:3000/api/recipes/1
curl -i http://localhost:3000/api/recipes/no-existe
```

## Pendiente

Definir validaciones y contratos para POST/PUT/DELETE, errores de validación, autenticación y acceso a MongoDB. No exponer secretos en el repositorio; cuando se conecte la base se añadirá un `.env.example` sin credenciales reales.
