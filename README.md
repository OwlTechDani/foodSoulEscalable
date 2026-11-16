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

Se recomienda Node.js 22.15 o posterior y npm (las pruebas del frontend usan las funciones integradas de Node). Usa dos terminales:

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

La API debe estar encendida. Si no responde, la interfaz informa del problema; no simula un guardado exitoso.

## Funciones disponibles

Consulta, búsqueda, categorías, paginación, publicación, edición y borrado de recetas. La API escucha únicamente en localhost. El formulario valida sus campos y la API vuelve a validarlos. Los datos duran hasta reiniciar el servidor.

## Verificar

```bash
cd backend
npm test
```

```bash
cd frontend
npm test
npm run build
```

## Estado y arquitectura

Prototipo de demostración sin cuentas ni permisos. MongoDB, comentarios y administración siguen pendientes. IA y Perfil son informativos.

Consulta [el estado y recorrido de revisión](docs/estado-del-proyecto.md), [la API](docs/api.md) y [los principios aplicados](docs/arquitectura.md).
