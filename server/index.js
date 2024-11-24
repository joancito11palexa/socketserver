import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let pedidos = []; // Lista de pedidos en memoria

io.on("connection", (socket) => {
  console.log("Client connected");

  // Enviar pedidos existentes al cliente que se conecta
  socket.emit("pedidos-actualizados", pedidos);

  // Recibir un nuevo pedido de la mesera
  socket.on("nuevo-pedido", (pedido) => {
    pedidos.push(pedido);
    io.emit("pedidos-actualizados", pedidos); // Notificar a todos los clientes
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
