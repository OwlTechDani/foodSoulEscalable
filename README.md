# Food For My Soul

Prototipo educativo para explorar y consultar recetas. El proyecto usa Angular en el cliente y Node.js + Express en una API REST pequeña. Sigue los temas de la materia Aplicaciones Web Escalables y la propuesta del proyecto Food For My Soul.

> **Estado:** avance inicial (aproximadamente 50%). Es una base para continuar en clase, no una entrega final. La API usa datos en memoria y solo permite consultar. No hay cuentas, escritura de recetas, MongoDB ni autorización.

## Requisitos

- Node.js 20 o 22 y npm.
- Angular CLI compatible con Angular 18: `npm install -g @angular/cli`.
- Visual Studio Code y Git son recomendados.

## Estructura

```text
foodSoulEscalable/
├── backend/                 # Express, rutas, controladores y mocks
├── frontend/                # Aplicación Angular standalone
└── docs/                    # Alcance, API, decisiones y siguientes pasos
```

## Ejecutar en desarrollo

Abre dos terminales desde la raíz del proyecto.

Terminal 1 - API:

```bash
cd backend
npm install
npm run dev
```

La API escucha en `http://localhost:3000`. Prueba `http://localhost:3000/api/health` y `http://localhost:3000/api/recipes`.

Terminal 2 - interfaz:

```bash
cd frontend
npm install
npm start
```

Angular abre `http://localhost:4200`. El cliente consulta la API; si esta no está disponible muestra las recetas de respaldo locales.

## Rutas de la interfaz

- `/` redirige al catálogo.
- `/recipes` lista recetas.
- `/recipes/:id` muestra el detalle de una receta.
- Cualquier otra ruta muestra la página de no encontrado.

## Qué está implementado

- Componentes Angular pequeños para navegación, tarjetas, catálogo, detalle y página no encontrada.
- Angular Router con enlaces internos y parámetro de ruta.
- Interfaces TypeScript para recetas.
- Servicio Angular que usa `HttpClient` y un fallback local.
- API Express organizada en servidor, rutas y controladores.
- Respuestas JSON y códigos HTTP básicos.
- Datos de ejemplo claramente marcados como mock.
- Búsqueda local por título e ingredientes y filtro por categoría.
- Documentación del alcance y tareas pendientes.

## Qué falta (intencionalmente)

- Formularios de registro, acceso y publicación con validaciones.
- Operaciones POST, PUT y DELETE para recetas y comentarios.
- MongoDB, Mongoose, modelos y persistencia.
- Autenticación JWT, roles y protección de rutas.
- Paginación, búsqueda desde la API y panel de administración.
- Pruebas automatizadas, carga de imágenes y despliegue.

Consulta [`docs/estado-del-proyecto.md`](docs/estado-del-proyecto.md) para el plan de continuación y [`docs/api.md`](docs/api.md) para los endpoints actuales.

Lee también [`docs/uso-de-ia-y-validacion.md`](docs/uso-de-ia-y-validacion.md) antes de usar este código como entrega académica.

## Nota académica

El material generado debe revisarse, ejecutarse y comprenderse antes de entregarlo. Explica cada archivo y adapta los datos, diseño y decisiones al trabajo propio. La propuesta y el contenido final siguen siendo responsabilidad del estudiante.

## Diseño del frontend

Consulta [componentes y diseño](docs/componentes-y-diseno.md) para las entradas, eventos, referencias visuales y comprobación manual del tablón de recetas.
