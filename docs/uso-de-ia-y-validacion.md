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

## Comprobación de la revisión visual del frontend

Se instalaron las dependencias y se ejecutó `npm run build` correctamente con validación de plantillas Angular. El bundle inicial es de aproximadamente 326 kB, dentro del presupuesto configurado.

La prueba en navegador y las capturas están pendientes: No se dispone de un navegador instalado verificado en este entorno. No se declara que la revisión visual o las pruebas de interacción hayan pasado. Sigue la lista manual de `componentes-y-diseno.md` antes de aprobar el PR.
