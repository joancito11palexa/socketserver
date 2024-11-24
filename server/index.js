import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Permitir cualquier origen (o especifica tu dominio)
    methods: ["GET", "POST"],
  },
});

let pedidos = []; // Lista de pedidos en memoria

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("pedidos-actualizados", pedidos);

  socket.on("nuevo-pedido", (pedido) => {
    pedidos.push(pedido);
    io.emit("pedidos-actualizados", pedidos);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Render proporciona el puerto en process.env.PORT
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
