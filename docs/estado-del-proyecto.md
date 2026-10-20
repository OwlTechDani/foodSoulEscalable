# Estado del proyecto

Esta etapa amplía la interfaz con navegación básica y prepara el flujo de publicación como borrador. El porcentaje de avance es una estimación académica; estas pantallas todavía no completan el MVP de la propuesta.

## Funciona

- Catálogo público y detalle de cada receta en Angular.
- Búsqueda por nombre en la interfaz, sobre las recetas ya cargadas.
- Rutas de Inicio, Comunidad, Publicar, IA y Perfil desde el encabezado.
- Filtro local por categoría en Comunidad.
- Formulario de borrador con validaciones y vista previa en Publicar, sin guardado.
- Backend inicial con Express, dotenv, CORS, rutas y controladores para consultas GET.
- Respuesta `404` para recetas inexistentes.
- Datos de ejemplo y respaldo local del catálogo cuando la API no está disponible.

## Falta

- Guardado de recetas y operaciones de escritura en la API.
- MongoDB y persistencia de recetas.
- Registro, acceso y permisos de usuario.
- Edición y borrado de recetas.
- Comentarios, perfiles y administración.
- Pruebas automatizadas y despliegue.

La API solo consulta datos de ejemplo guardados en memoria. IA y Perfil son páginas informativas hasta que se desarrollen el asistente y las cuentas.
