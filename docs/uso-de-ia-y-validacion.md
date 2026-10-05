# Uso de IA y verificación académica

## Apoyo utilizado

La estructura inicial de este prototipo, sus ejemplos de código y parte de esta documentación se generaron con ayuda de ChatGPT a partir de la propuesta Food For My Soul y del material de Aplicaciones Web Escalables. La propuesta del proyecto, su objetivo y las decisiones finales deben ser revisadas y defendidas por Daniel Pacheco Martínez, estudiante responsable del trabajo.

No se debe afirmar que el código fue escrito íntegramente sin asistencia. Este documento puede actualizarse para describir con precisión las modificaciones y herramientas que se usen después.

## Verificación pendiente del estudiante

Antes de entregar o publicar:

1. Instalar dependencias y ejecutar frontend y backend por separado.
2. Abrir `/api/health`, `/api/recipes` y `/api/recipes/1`; confirmar que las respuestas coinciden con `docs/api.md`.
3. Probar una receta inexistente y una ruta inexistente; observar el estado `404`.
4. Abrir el catálogo, entrar a una receta, volver al catálogo y probar una URL inválida.
5. Apagar el backend y comprobar el fallback del cliente.
6. Leer cada archivo y poder explicar componentes, interfaces, servicio, rutas, controlador, middleware y datos mock.
7. Cambiar y validar el contenido y diseño para que correspondan con la versión propia del proyecto.

## Límite de comprobación de esta copia

Se validó la sintaxis de los archivos del backend con `node --check` y el formato JSON de los archivos de configuración. No se completó `npm install` ni se ejecutó una compilación Angular en el entorno de preparación porque las descargas de npm quedaron pendientes con la red restringida. Por tanto, los pasos anteriores siguen siendo necesarios; no se declara esta versión como compilada ni probada de extremo a extremo.
