const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:4200" }));
    this.app.use(express.json());

    this.routes();
    this.app.use((err, _req, res, _next) => {
      if (err.type === "entity.parse.failed") return res.status(400).json({ error: "El cuerpo debe ser JSON válido" });
      if (err.type === "entity.too.large") return res.status(413).json({ error: "La receta es demasiado grande" });
      if (err.code === 11000) return res.status(409).json({ error: 'El correo o elemento ya existe' });
      console.error(err);
      res.status(500).json({ error: "No se pudo procesar la petición" });
    });
  }

  routes() {
    this.app.get("/api/health", (_req, res) => {
      res.status(200).json({ status: "ok" });
    });

    this.app.use("/api/recipes", require("../routes/recipes"));
    this.app.use("/api/auth", require("../routes/auth"));
    this.app.use("/api/admin", require("../routes/admin"));

    this.app.use((_req, res) => {
      res.status(404).json({ error: "Ruta no encontrada" });
    });
  }

  listen() {
    return this.app.listen(this.port, "localhost", () => {
      console.log(`Food For My Soul API escuchando en http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
