# Estado del proyecto

## Avance de esta etapa

Se completó el recorrido de gestión de recetas del prototipo: consultar, buscar, filtrar, publicar, editar y eliminar desde Angular y Express. El objetivo solicitado es llegar al 80 %, pero no hay una rúbrica que permita certificar ese porcentaje del MVP: todavía faltan cuentas, permisos, MongoDB, comentarios y administración.

## Disponible para revisar

- Inicio con búsqueda por nombre y detalle con ingredientes y pasos.
- Comunidad con búsqueda por nombre, filtro por categoría y paginación local de seis recetas.
- Publicación con autor, título, descripción, categoría, minutos, ingredientes, pasos e imagen por URL opcional.
- Validaciones del formulario y validación independiente en el servidor.
- Edición del contenido con el mismo formulario.
- Eliminación con confirmación y opción para cancelar.
- Estados de carga, errores de conexión y respuestas de receta inexistente.
- API GET, POST, PUT y DELETE con respuestas JSON y códigos HTTP.

## Límites de la demostración

Las recetas están en memoria: sobreviven a la navegación y recarga del navegador, pero se reinician al apagar la API. No hay autenticación: cualquier visitante puede modificar cualquier receta. Perfil e IA siguen siendo páginas informativas. No se implementaron JWT ni dependencias nuevas; el Markdown de principios se utilizó como guía para separar responsabilidades, no como instrucción para migrar el backend a TypeScript.

## Verificación realizada

- Prueba HTTP automatizada con el corredor integrado de Node: CRUD, validaciones, JSON incorrecto, filtros y respuestas 404.
- Compilación de Angular.
- Recorrido de navegador: crear, editar, cancelar y confirmar borrado, y filtrar.
- Comprobación móvil a 390 px sin desbordamiento horizontal ni errores de Angular.

## Para revisar la entrega

1. Abrir http://localhost:4200 y buscar una receta en Inicio.
2. Entrar a Comunidad y combinar nombre y categoría.
3. Publicar una receta válida: debe abrirse su detalle.
4. Editarla y comprobar el cambio en el detalle.
5. Cancelar un borrado y después confirmarlo.
6. Comprobar que desapareció de Comunidad.

El código de esta etapa queda en commits locales hasta la revisión del usuario.
