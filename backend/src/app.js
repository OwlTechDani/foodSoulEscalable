// Punto de entrada: carga configuración, prepara la app Express y arranca el servidor.
require("dotenv").config();

const Server = require("./models/server");

const server = new Server();
server.listen();
