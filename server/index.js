import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { Pedido, Plato } from './models/index.js';
import { obtenerPedidos, crearPedido, eliminarPedido, marcarComoEntregado } from './controllers/pedidosController.js';
import { obtenerPlatos, crearPlato, eliminarPlato } from './controllers/platosController.js';

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

// Función para obtener el total de ganancias
let pedidosEntregados = 0;
const calcularGanancias = () => pedidosEntregados * 10; // Cambiar según el precio

// Manejo de los eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar pedidos y platos al cliente
  obtenerPedidos().then((pedidos) => socket.emit("pedidos-actualizados", pedidos));
  obtenerPlatos().then((platos) => socket.emit("platos-actualizados", platos));
  socket.emit("ganancias-actualizadas", calcularGanancias());

  // Manejar nuevo pedido
  socket.on("nuevo-pedido", async (plato, imagen, precio) => {
    await crearPedido(plato, imagen, precio);
    const pedidos = await obtenerPedidos();
    io.emit("pedidos-actualizados", pedidos);
  });

  // Crear nuevo plato
  socket.on("crear-plato", async (nuevoPlato) => {
    await crearPlato(nuevoPlato);
    const platos = await obtenerPlatos();
    io.emit("platos-actualizados", platos);
  });

  // Eliminar un pedido
  socket.on("eliminar-pedido", async (id) => {
    await eliminarPedido(id);
    const pedidos = await obtenerPedidos();
    io.emit("pedidos-actualizados", pedidos);
  });

  // Marcar un pedido como entregado
  socket.on("marcar-entregado", async (id) => {
    await marcarComoEntregado(id);
    const pedidos = await obtenerPedidos();
    io.emit("pedidos-actualizados", pedidos);
    io.emit("ganancias-actualizadas", calcularGanancias());
  });

  // Eliminar un plato
  socket.on("eliminar-plato", async (id) => {
    await eliminarPlato(id);
    const platos = await obtenerPlatos();
    io.emit("platos-actualizados", platos);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
