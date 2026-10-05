# Estado del proyecto y alcance

## Propósito

Food For My Soul es un catálogo comunitario de recetas. Las personas visitantes podrán descubrir recetas; en una versión posterior, quienes creen una cuenta podrán publicar y administrar sus recetas y comentarios.

## Avance incluido

Esta primera base implementa el recorrido público de consulta: Angular presenta un catálogo, abre el detalle por identificador y obtiene los datos desde una API REST hecha con Express. Tanto el servidor como el cliente tienen datos de respaldo de ejemplo. No se guarda información entre reinicios.

El alcance se dejó deliberadamente a medio camino. No se debe interpretar la presencia de una receta de ejemplo como contenido real ni la disponibilidad de una pantalla pública como autenticación implementada.

## Módulos planeados según la propuesta

| Módulo | Estado en esta base | Observación |
| --- | --- | --- |
| Inicio y catálogo público | Parcial | Catálogo consultable, sin búsqueda ni filtros |
| Detalle de receta | Parcial | Datos, ingredientes y preparación; comentarios pendientes |
| Registro e inicio de sesión | Pendiente | Sin usuarios ni sesiones |
| Publicar, editar y borrar | Pendiente | API actual es de solo lectura |
| Perfil | Pendiente | No hay identidad de usuario |
| Administración y moderación | Pendiente | Sin roles ni panel |
| Categorías y etiquetas | Mock | Presentes como texto de ejemplo, sin catálogo administrable |
| Likes, guardados y asistente IA | Fuera del MVP inicial | Ideas para versiones posteriores |

## Conceptos de clase que aparecen

- Angular y TypeScript para el cliente.
- Componentes reutilizables e interpolación en plantillas.
- `*ngFor` para repetir tarjetas y `*ngIf` para estados simples.
- Angular Router, `routerLink`, `router-outlet`, redirección y ruta comodín.
- Interfaces, servicio con inyección y `HttpClient` con observables.
- Node.js con Express, middleware JSON/CORS, rutas por módulo y controladores.
- API REST con GET, JSON y códigos HTTP `200`, `404` y `500`.

La organización emplea Angular standalone (Angular 18) para evitar módulos ceremoniales y CommonJS en el servidor para mantener el backend cercano a los ejemplos introductorios de Node/Express.

## Siguiente orden sugerido

1. Revisar las recetas mock y reemplazarlas con contenido propio.
2. Implementar búsqueda por título y filtros del catálogo.
3. Crear formulario de receta con validaciones y primero probarlo con datos en memoria.
4. Agregar operaciones de escritura a Express y documentar sus respuestas.
5. Diseñar esquemas Mongoose y conectar MongoDB usando variables de entorno.
6. Añadir registro e inicio de sesión; proteger acciones privadas y validar permisos en el servidor.
7. Implementar comentarios, perfil y administración.
8. Añadir pruebas, revisión responsive y despliegue.

## Criterio para considerar este avance completo

La interfaz puede arrancar, consultar la API y mostrar el catálogo y detalle; la documentación declara sus límites. El proyecto todavía no cumple el MVP funcional de la propuesta y requiere completar los pendientes antes de presentarlo como sistema terminado.
