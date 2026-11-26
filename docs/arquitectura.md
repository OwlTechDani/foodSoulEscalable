# Arquitectura

Se conserva Angular 18 y la estructura Express existente. Las dependencias agregadas y autorizadas son Mongoose y jsonwebtoken. Docker ejecuta MongoDB 8.0 en un servicio independiente.

- `backend/src/app.ts`: carga dotenv, conecta MongoDB y arranca el servidor; se compila en `backend/dist/`.
- `backend/src/database/config.ts`: conexión y catálogos iniciales, sin usuarios ni recetas precargados.
- `backend/src/models/`: `user.ts`, `recipe.ts`, `catalog.ts` y `server.ts`. Los comentarios viven dentro de la receta.
- `backend/src/routes/` y `backend/src/controllers/`: endpoints, validación y respuestas (`.ts`).
- `backend/src/middleware/auth.ts`: verifica JWT, estado actual de la cuenta y permisos de administrador.
- `backend/src/helpers/password.ts`: protege y comprueba contraseñas usando crypto de Node.
- `backend/src/helpers/async.ts`: envía los errores de las operaciones asíncronas al manejador de Express.
- `frontend/src/app/services/`: acceso HTTP y estado de sesión mediante observables.
- `frontend/src/app/pages/`: Inicio, Comunidad, Publicar/Editar, Perfil, Administración y Bot de ayuda.

El formulario de recetas se reutiliza para crear y editar. Las tarjetas se comparten entre catálogo y perfil. La autorización siempre se verifica en el servidor; ocultar botones es únicamente una ayuda de la interfaz.

La sesión usa JWT en sessionStorage de la pestaña. El servidor guarda una versión de sesión para revocar tokens al salir o desactivar una cuenta. Los secretos quedan fuera de Git. El bot usa condiciones y opciones en su componente, sin IA ni persistencia de contexto. No se agregaron bibliotecas visuales.
