const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // Middleware básico: permite JSON y peticiones desde el servidor Angular local.
    this.app.use(cors({ origin: "http://localhost:4200" }));
    this.app.use(express.json());

    this.routes();
  }

  routes() {
    this.app.get("/api/health", (_req, res) => {
      res.status(200).json({ status: "ok" });
    });

    // Cada módulo de rutas agrupa endpoints relacionados.
    this.app.use("/api/recipes", require("../routes/recipes"));

    // Respuesta JSON consistente para rutas desconocidas.
    this.app.use((_req, res) => {
      res.status(404).json({ error: "Ruta no encontrada" });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Food For My Soul API escuchando en http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
