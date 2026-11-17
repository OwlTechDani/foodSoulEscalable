# Arquitectura

Se conserva Angular 18 y la estructura Express existente. Las dependencias agregadas y autorizadas son Mongoose y jsonwebtoken. Docker ejecuta MongoDB 8.0 en un servicio independiente.

- `backend/src/app.js`: carga dotenv, conecta MongoDB y arranca el servidor.
- `database/config.js`: conexión y catálogos iniciales, sin usuarios ni recetas precargados.
- `models/`: usuarios, recetas, comentarios integrados en la receta, catálogos y servidor.
- `routes/`: endpoints; `controllers/`: validación y coordinación de respuestas.
- `middleware/auth.js`: verifica JWT, estado actual de la cuenta y permisos de administrador.
- `helpers/password.js`: protege y comprueba contraseñas usando crypto de Node.
- `helpers/async.js`: envía los errores de las operaciones asíncronas al manejador de Express.
- `frontend/src/app/services/`: acceso HTTP y estado de sesión mediante observables.
- `pages/`: Inicio, Comunidad, Publicar/Editar, Perfil, Administración y Bot de ayuda.

El formulario de recetas se reutiliza para crear y editar. Las tarjetas se comparten entre catálogo y perfil. La autorización siempre se verifica en el servidor; ocultar botones es únicamente una ayuda de la interfaz.

La sesión usa JWT en sessionStorage de la pestaña. El servidor guarda una versión de sesión para revocar tokens al salir o desactivar una cuenta. Los secretos quedan fuera de Git. El bot usa condiciones y opciones en su componente, sin IA ni persistencia de contexto. No se agregaron bibliotecas visuales.
