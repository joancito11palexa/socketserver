import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js"; // Importar sequelize para la conexión a la base de datos
import { conectarPedidosSocket } from "./sockets/pedidosSocket.js";
import { conectarPlatosSocket } from "./sockets/platosSocket.js";
import apiSisapRoute from "./routes/apiSisapRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import boomarksRoutes from "./routes/bookmarksRoutes.js";

import { Cliente } from "./models/Cliente.js"; // Asegúrate de importar el modelo Cliente
import routerPedidos from "./routes/pedidosRoutes.js";

const app = express();
app.use(express.json({ limit: "50mb" }));

const server = http.createServer(app);
const corsOptions = {
  origin: [
    "https://snappit-gbom62x66-joan2022laurentes-projects.vercel.app",
    "https://snappit-liart.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173", // Dominio de desarrollo (Vite)
    "https://restaurantproject1632.netlify.app", // Dominio de producción
    "https://restaurantapp2004.onrender.com",
    "http://192.168.0.109:5173",
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
const io = new SocketServer(server, {
  cors: {
    origin: [
      "https://snappit-gbom62x66-joan2022laurentes-projects.vercel.app",
    "https://snappit-liart.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173", // Dominio de desarrollo (Vite)
      "https://restaurantproject1632.netlify.app", // Dominio de producción
      "https://restaurantapp2004.onrender.com",
      "http://192.168.0.109:5173",
    ],
    methods: ["GET", "POST", "DELETE", ""],
    credentials: true,
  },
});

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexión establecida exitosamente.");

    const clienteDefault = await Cliente.findByPk(2004);
    const usuarioAdmin = await Cliente.findOne({
      where: { esAdministrador: true },
    });
    if (!clienteDefault) {
      await Cliente.create({
        id: 2004,
        nombre: "Cliente Default",
        email: "default@example.com",
        password: "123456",
      });

      console.log("Cliente default creado con id 2004.");
    } else {
      console.log("Cliente default ya existe.");
    }
    if (!usuarioAdmin) {
      await Cliente.create({
        nombre: "Administrador",
        email: "admin@gmail.com",
        password: "2004",
        esAdministrador: true,
      });
      console.log("Usuario administrador creado.");
    } else {
      console.log("Usuario administrador ya existe.");
    }
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tablas sincronizadas correctamente (force: false).");
  })
  .catch((err) => {
    console.error("Error al sincronizar las tablas:", err);
  });
io.on("connection", (socket) => {
  console.log("Cliente conectado");
  conectarPedidosSocket(io, socket);
  conectarPlatosSocket(io, socket);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
app.use("/api", clienteRoutes, routerPedidos, boomarksRoutes);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
