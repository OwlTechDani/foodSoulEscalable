# Food For My Soul

Recetario comunitario con Angular 18, TypeScript, Node.js, Express y MongoDB. Incluye registro, inicio y cierre de sesión, recetas, comentarios, perfil y administración. El asistente de IA es la única función del alcance actual que sigue pendiente.

## Ejecutar en local

Requisitos: Node.js 22.15 o posterior, npm y Docker con soporte de contenedores Linux.

Desde la raíz, inicia MongoDB:

```bash
docker compose up -d mongo
```

FoodSoul utiliza un contenedor y volumen propios. MongoDB se publica solo en `127.0.0.1:27018`, separado de otros proyectos que usan `27017`.

En una terminal:

```bash
cd backend
npm install
```

Copia `.env.example` como `.env` si todavía no existe. Define `JWT_SECRET` con al menos 32 caracteres aleatorios. Puedes generar un valor con:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

La copia local de desarrollo ya tiene su `.env` configurado. No publiques ese archivo.

```bash
npm start
```

En otra terminal, desde la raíz:

```bash
cd frontend
npm install
npm start
```

Abre http://localhost:4200. La API escucha en http://localhost:3000.

## Uso

- Inicio y Comunidad permiten buscar y consultar recetas sin iniciar sesión.
- En Perfil puedes crear una cuenta, entrar, salir y consultar tus recetas.
- Para publicar elige categoría, tipo y etiquetas. La imagen es opcional mediante URL.
- Cada usuario puede editar y borrar sus recetas y sus comentarios.
- El administrador puede moderar todo el contenido, activar o desactivar cuentas, cambiar roles y gestionar categorías, tipos y etiquetas.
- Un elemento del catálogo en uso no se puede modificar o borrar hasta actualizar las recetas asociadas.

## Crear un administrador

Registra primero tu cuenta desde Perfil. Después, en `backend`, ejecuta:

```bash
npm run admin -- tu-correo@example.com
```

Recarga la página y abre Administración desde Perfil. No hay usuarios ni contraseñas predeterminados.

## Verificar

Con MongoDB de Docker encendido, ejecuta en `backend`:

```bash
npm test
```

Las pruebas usan una base aislada con nombre aleatorio y la eliminan al finalizar. No usan la base de la aplicación.

En `frontend`:

```bash
npm test
npm run build
```

Para detener MongoDB conservando datos: `docker compose stop`. No borres el volumen si quieres conservar cuentas, recetas y comentarios.

Consulta [la API](docs/api.md), [la arquitectura](docs/arquitectura.md) y [el estado](docs/estado-del-proyecto.md).
