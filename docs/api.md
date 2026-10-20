# API de desarrollo

Base local: `http://localhost:3000/api`. Las rutas implementadas responden JSON.

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/health` | `{ "status": "ok" }` |
| GET | `/recipes` | Lista de recetas en `data` |
| GET | `/recipes/:id` | Una receta en `data`; `404` si no existe |

Las recetas son datos de ejemplo en `backend/src/data/recipes.js`. Esta versión no ofrece `POST`, `PUT` ni `DELETE`.
