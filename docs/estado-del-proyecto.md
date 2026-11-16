# Estado del proyecto

## Implementado

- Catálogo y detalle públicos con ingredientes, pasos, autor, imagen y clasificación.
- Búsqueda, filtros combinados por categoría, tipo y etiqueta y paginación.
- Registro, acceso, cierre de sesión y perfil con recetas propias.
- Publicación, edición y eliminación con validaciones y permisos de autor.
- Comentarios con edición y eliminación por su autor; moderación por administrador.
- Administración de usuarios, roles, estado activo y catálogos de categorías, tipos y etiquetas.
- Persistencia de cuentas y contenido en MongoDB mediante Docker con volumen propio.
- Logo del proyecto y footer con redes y contacto ficticio.
- Estados de carga, errores por campo, confirmaciones de borrado y vista móvil.

## Pendiente

El asistente de IA se conserva como ampliación pendiente. No hay conexión a ningún servicio de IA.

## Verificación

Las pruebas HTTP usan MongoDB real en una base aislada: registro, contraseñas protegidas, JWT, permisos entre cuentas, comentarios, administración, catálogos en uso, persistencia tras reconectar y revocación de sesiones. Las pruebas de componentes verifican publicación, edición, borrado, navegación y reinicio de página al filtrar.

Se verificó en navegador el recorrido con dos cuentas, la administración de catálogos, errores por campo, logo, ocho redes del footer y la vista móvil con títulos largos. Las cuentas y recetas temporales de esa revisión se eliminaron. Angular compila correctamente.

## Revisión local

Abre http://localhost:4200. Regístrate en Perfil y publica una receta. Para administrar, promueve tu propia cuenta con el comando descrito en README. Los cambios de esta entrega quedan en commits locales hasta que el usuario decida publicarlos.

Este entorno se prepara para uso local: API y MongoDB solo se publican en el equipo. Un despliegue público requiere configurar HTTPS, secretos y copias de seguridad propios del servidor.
