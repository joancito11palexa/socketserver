import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js"; // Importar sequelize para la conexión a la base de datos
import { conectarPedidosSocket } from "./sockets/pedidosSocket.js";
import { conectarPlatosSocket } from "./sockets/platosSocket.js";

const app = express();
const server = http.createServer(app);

// Configura CORS para Express
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

// Configuración de Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Conexión a la base de datos y consulta de tablas
sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexión establecida exitosamente.");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

// Forzar la sincronización de la base de datos
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tablas sincronizadas correctamente (force: false).");
  })
  .catch((err) => {
    console.error("Error al sincronizar las tablas:", err);
  });

// Establecer conexión para los eventos de socket relacionados con los pedidos
conectarPedidosSocket(io);

// Establecer conexión para los eventos de socket relacionados con los platos
conectarPlatosSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
