import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js"; // Importar sequelize para la conexión a la base de datos
import { conectarPedidosSocket } from "./sockets/pedidosSocket.js";
import { conectarPlatosSocket } from "./sockets/platosSocket.js";
import apiSisapRoute from "./routes/apiSisapRoutes.js";
import { Cliente } from "./models/Cliente.js"; // Asegúrate de importar el modelo Cliente

const app = express();
app.use(express.json());
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "https://restaurantproject1632.netlify.app", // Dominio de producción
    "http://localhost:5173", // Dominio de desarrollo (Vite)
  ],
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

const io = new SocketServer(server, {
  cors: {
    origin: [
      "https://restaurantproject1632.netlify.app", // Dominio de producción
      "http://localhost:5173", // Dominio de desarrollo (Vite)
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexión establecida exitosamente.");

    // Verificar si el cliente por defecto con id 2004 existe
    const clienteDefault = await Cliente.findByPk(2004);
    if (!clienteDefault) {
      // Crear el cliente por defecto si no existe
      await Cliente.create({
        id: 2004,
        nombre: "Cliente Default", // Puedes personalizar el nombre u otros campos según lo necesites
        email: "default@example.com", // Asegúrate de proporcionar un email por defecto
        // Otros campos del cliente si es necesario
      });
      console.log("Cliente default creado con id 2004.");
    } else {
      console.log("Cliente default ya existe.");
    }
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });


sequelize
  .sync({ force: false }) // Usar `force: true` borrará y recreará todas las tablas
  .then(() => {
    console.log("Tablas sincronizadas correctamente (force: false).");
  })
  .catch((err) => {
    console.error("Error al sincronizar las tablas:", err);
  });

conectarPedidosSocket(io);
conectarPlatosSocket(io);

app.use("/", apiSisapRoute);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
