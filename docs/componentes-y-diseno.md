# Tablón de cocina: componentes y diseño

## Propuesta visual

Un recetario reunido en un tablón: fotos verticales y horizontales, fichas de categorías y apuntes de cuaderno. La marca circular `f.`, el rojo de especias y el verde de hojas dan identidad. Arial y Georgia son fuentes del sistema; no hay bibliotecas de UI ni tipografías remotas.

Referencias de organización y ambiente, sin copiar su código o componentes:
- [Pinterest Create: tableros y secciones](https://create.pinterest.com/product-features/how-to-create-boards/)

Composición y componentes creados para Food For My Soul con asistencia de ChatGPT. Las fotografías externas de Unsplash son las imágenes mock originales del proyecto; requieren conexión y deben reemplazarse por contenido propio.

## Componentes

| Componente | Función | Entradas | Eventos |
| --- | --- | --- | --- |
| SiteHeader | Marca y rutas | Ninguna | Ninguno |
| SiteFooter | Información del recetario | Ninguna | Ninguno |
| RecipeSearch | Formulario de búsqueda | query | search: string |
| CategoryFilter | Categorías seleccionables | categories, selected | categoryChange: string |
| RecipeCard | Foto, resumen y enlace | recipe, portrait | Ninguno |
| KitchenNote | Apunte editorial | number, title, text | Ninguno |
| RecipeList | Obtener y filtrar recetas | Ninguna | Ninguno |

Archivos en `frontend/src/app/components`; plantillas pequeñas junto a su clase y estilos comunes en `frontend/src/styles.css`. Ejemplo: `<app-recipe-card [recipe]="recipe" [portrait]="true" />`.

## Angular básico

El padre conserva `query` y `selectedCategory`. La búsqueda usa FormsModule y ngModel; comunica texto mediante @Output/EventEmitter. El filtro recibe su selección con @Input y emite cambios. El getter filteredRecipes combina categoría y búsqueda en títulos e ingredientes. El servicio y la API conservan sus datos mock.

## Adaptación y accesibilidad

Tres columnas en escritorio, dos hasta 900 px y una hasta 560 px. CSS columns produce distintas alturas sin cálculos JavaScript. El orden de lectura es vertical por columna, no por filas. Imágenes con alt, etiqueta de búsqueda, botones nativos, aria-pressed, foco visible, enlace para saltar al contenido, conteo aria-live y preferencia de movimiento reducido.

## Alcance y prueba manual

La búsqueda es local sobre datos descargados o mock. No hay guardados, publicación, cuentas ni paginación. Las notas editoriales no son recetas y solo aparecen con resultados. Se conserva el avance parcial del proyecto.

1. Iniciar frontend y API según README.
2. Buscar pasta y huevo; combinar texto y categoría.
3. Buscar algo inexistente y verificar cero resultados.
4. Abrir una tarjeta, volver y navegar usando Tab.
5. Revisar a 1280, 768 y 390 px.
6. Apagar la API y repetir usando el fallback.

## Decisiones para continuar

Los colores se editan en `:root`; Georgia identifica títulos y apuntes, Arial mantiene legibles los controles. No se añadió framework de diseño, estados globales, animación compleja ni algoritmo de masonry. La tarjeta alterna `portrait` para variar el tablón sin modificar los datos. Las fotos se recortan con `object-fit: cover`.

`resetFilters()` limpia tanto el texto visible del buscador como la categoría. El desplazamiento al pie usa el fragmento del Router con `withInMemoryScrolling`. Los formularios y servicios se mantienen separados: los controles emiten acciones y RecipeList filtra los datos.

Para añadir otro componente: crear su carpeta, declarar `standalone: true`, definir entradas/eventos necesarios e importarlo en el componente que lo usa. Los componentes no deben descargar recetas por separado.
