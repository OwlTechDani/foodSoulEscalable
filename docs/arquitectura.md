# Organización y principios

Se conserva Angular 18 y el backend Express en JavaScript existente. No se agregaron dependencias.

- **Separación de responsabilidades:** las rutas declaran endpoints; los controladores validan y coordinan respuestas; `data/recipes.js` mantiene los datos temporales; `models/server.js` configura Express; `app.js` inicia el servidor.
- **Responsabilidad única:** cada página atiende un recorrido y `RecipeService` centraliza el acceso HTTP. Las vistas no escriben directamente sobre los datos del backend.
- **Reutilización:** un formulario sirve para crear y editar; las tarjetas se comparten entre Inicio y Comunidad. La validación y normalización de POST y PUT usan funciones comunes dentro del controlador.
- **Encapsulamiento y tipos:** se conserva la clase Server. Angular usa interfaces para los datos de recetas y dependencias privadas por constructor.
- **Proporción:** no se crean carpetas de base de datos, helpers de JWT ni capas adicionales sin una necesidad implementada. La futura conexión MongoDB deberá quedar separada del servidor y los controladores.

La API todavía no identifica usuarios. El ejemplo de autenticación JWT del documento de principios no equivale a una funcionalidad disponible en esta etapa.
