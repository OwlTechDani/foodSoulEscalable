# API

Base: `http://localhost:3000/api`. El servidor escucha solo en localhost y responde JSON. Las escrituras requieren `Authorization: Bearer <token>` salvo registro y acceso.

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/health` | Estado del servidor |
| POST | `/auth/register` | Nombre, correo y contraseña; devuelve usuario y JWT |
| POST | `/auth/login` | Correo y contraseña; devuelve usuario y JWT |
| GET | `/auth/me` | Cuenta actual |
| POST | `/auth/logout` | Invalida las sesiones de la cuenta |
| GET | `/recipes` | Lista pública, sin comentarios |
| GET | `/recipes/:id` | Detalle y comentarios públicos |
| POST | `/recipes` | Crear receta con autor de la sesión |
| PUT | `/recipes/:id` | Editar receta propia o como administrador |
| DELETE | `/recipes/:id` | Borrar receta y sus comentarios |
| POST | `/recipes/:id/comments` | Comentar con `{ text }` |
| PUT | `/recipes/:id/comments/:commentId` | Editar comentario propio o como administrador |
| DELETE | `/recipes/:id/comments/:commentId` | Borrar comentario propio o como administrador |
| GET | `/admin/catalog` | Catálogos públicos |
| POST | `/admin/catalog` | Administrador: crear `{ kind, name }` |
| PUT | `/admin/catalog/:id` | Administrador: modificar un elemento sin referencias |
| DELETE | `/admin/catalog/:id` | Administrador: eliminar un elemento sin referencias |
| GET | `/admin/users` | Administrador: listar usuarios sin contraseñas |
| PUT | `/admin/users/:id` | Administrador: cambiar `{ active, role }` de otra cuenta |

Las listas y detalles usan `{ data }`. Registro y acceso devuelven `{ user, token }`. Los identificadores son cadenas UUID.

`GET /recipes` admite `q`, `category`, `type`, `tag` y `owner`. En Comunidad los filtros se combinan y la interfaz pagina seis recetas por vista.

## Recetas

POST y PUT reciben `title` (3–120 caracteres), `description` (mínimo 10), `category`, `recipeType`, `tags` (arreglo), `prepMinutes` (entero 1–1440), `ingredients` y `steps` (arreglos de texto no vacío). `imageUrl` es opcional y se valida y normaliza con URL de Node. Categorías, tipos y etiquetas deben existir en sus catálogos. El servidor asigna autor y propietario; no confía en los enviados por el cliente.

Los comentarios aceptan de 1 a 2000 caracteres. El registro requiere nombre de 2–80 caracteres, correo válido y contraseña de 8–128 caracteres. Las contraseñas se guardan con scrypt y sal aleatoria. Los JWT vencen en ocho horas; cerrar sesión o desactivar una cuenta invalida sus tokens anteriores.

## Respuestas

- 200: consulta o edición; 201: creación; 204: eliminación o cierre de sesión.
- 400: datos inválidos; recetas incluyen `{ error, errors }` con mensajes por campo.
- 401: sesión ausente, vencida o inválida; 403: falta de permiso.
- 404: recurso inexistente; 409: correo repetido, catálogo repetido o en uso.
- 413: cuerpo demasiado grande; 429: demasiados intentos de acceso o registro; 500: fallo inesperado.

La protección de intentos permite 30 solicitudes de registro o acceso por minuto para esta aplicación local. No sustituye la configuración necesaria para un despliegue público.
