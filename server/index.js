import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));

// Servidor HTTP y WebSocket
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Permite todas las conexiones en desarrollo/producción
  },
});

// Almacén de pedidos en memoria
let pedidos = [];

// Configuración de eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar los pedidos existentes al cliente
  socket.emit("pedidos-actualizados", pedidos);

  // Manejar nuevos pedidos
  socket.on("nuevo-pedido", (pedido) => {
    pedidos.push(pedido);
    io.emit("pedidos-actualizados", pedidos); // Enviar a todos los clientes
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Usar el puerto proporcionado por Render o un puerto local
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
