import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js"; // Importar sequelize para la conexión a la base de datos
import { conectarPedidosSocket } from "./sockets/pedidosSocket.js";
import { conectarPlatosSocket } from "./sockets/platosSocket.js";
import apiSisapRoute from "./routes/apiSisapRoutes.js"

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
conectarPedidosSocket(io);
conectarPlatosSocket(io);


app.use("/", apiSisapRoute)



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
