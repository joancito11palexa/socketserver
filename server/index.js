import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { Pedido } from './db.js'; // Importamos el modelo de la base de datos

const app = express();
app.use(cors());
app.use(morgan("dev"));

const server = http.createServer(app);
const io = new SocketServer(server);

let pedidosEntregados = 0; // Contador de pedidos entregados

// Función para obtener el total de ganancias
const calcularGanancias = () => {
  return pedidosEntregados * 10; // Aquí puedes cambiar el precio de cada plato
};

// Recuperar pedidos de la base de datos
const obtenerPedidos = async () => {
  return await Pedido.findAll();
};

// Manejo de los eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar los pedidos actuales desde la base de datos al cliente
  obtenerPedidos().then((pedidos) => {
    socket.emit("pedidos-actualizados", pedidos);
  });
  socket.emit("ganancias-actualizadas", calcularGanancias());

  // Recibir nuevo pedido y guardarlo en la base de datos
  socket.on("nuevo-pedido", async (plato, imagen, precio) => {
    const nuevoPedido = await Pedido.create({ plato, imagen, precio, estado: "pendiente" });
    const pedidos = await obtenerPedidos();
    io.emit("pedidos-actualizados", pedidos);
  });
  
  // Eliminar un pedido de la base de datos
  socket.on("eliminar-pedido", async (id) => {
    await Pedido.destroy({ where: { id } });
    const pedidos = await obtenerPedidos();
    io.emit("pedidos-actualizados", pedidos);
  });

  // Marcar un pedido como entregado
  socket.on("marcar-entregado", async (id) => {
    const pedido = await Pedido.findByPk(id);
    if (pedido && pedido.estado !== "entregado") {
      pedido.estado = "entregado";
      await pedido.save();
      pedidosEntregados++;
      const pedidos = await obtenerPedidos();
      io.emit("pedidos-actualizados", pedidos);
      io.emit("ganancias-actualizadas", calcularGanancias());
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
