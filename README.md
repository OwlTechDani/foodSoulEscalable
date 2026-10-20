# Food For My Soul

Aplicación de recetas en desarrollo. Permite consultar un catálogo, buscar por nombre y ver el detalle de cada receta.

## Tecnologías

- Interfaz: Angular 18, TypeScript, HTML y CSS.
- API: Node.js y Express.
- Datos: recetas de ejemplo en memoria.

## Organización

- `frontend/`: páginas, componentes, rutas y servicio de recetas.
- `backend/`: servidor Express, rutas, controladores y datos de ejemplo.
- `docs/`: estado del proyecto y contrato de la API.

## Ejecutar en local

Se recomienda Node.js 20 o 22 y npm. Usa dos terminales:

**API**

```bash
cd backend
npm install
npm run dev
```

Se abre en `http://localhost:3000`. Comprueba `http://localhost:3000/api/health`.

**Interfaz**

```bash
cd frontend
npm install
npm start
```

Abre `http://localhost:4200`. El encabezado permite ir a Inicio (`/`), Comunidad (`/comunidad`), Publicar (`/publicar`), IA (`/ia`) y Perfil (`/perfil`). El detalle de una receta está en `/recipes/:id`; `/recipes` vuelve al inicio.

El catálogo utiliza recetas locales de respaldo si la API no responde.

## Funciones disponibles

- Catálogo y búsqueda por nombre en Inicio.
- Filtro por categoría en Comunidad.
- Formulario de borrador con validaciones y vista previa en Publicar. No guarda la receta.
- Detalle con ingredientes y pasos.
- API JSON de consulta. Consulta [docs/api.md](docs/api.md) para las rutas y ejemplos.

## Estado

El backend se mantiene como una base inicial de solo lectura. IA y Perfil son páginas informativas; faltan guardado de recetas, persistencia con MongoDB, cuentas y acceso, edición, comentarios, pruebas y despliegue. El detalle está en [docs/estado-del-proyecto.md](docs/estado-del-proyecto.md).
