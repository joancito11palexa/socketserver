import {
  obtenerPedidos,
  crearPedido,
  eliminarPedido,
  marcarComoEntregado,
  obtenerPedidosSocket
} from "../controllers/pedidosController.js";

export const conectarPedidosSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    try {
      const pedidos = await obtenerPedidosSocket();
      socket.emit("pedidos-actualizados", pedidos);
    } catch (error) {
      console.error("Error al enviar pedidos iniciales:", error.message);
    }

    socket.on("nuevo-pedido", async (descripcion) => {
      try {
        await crearPedido(descripcion);
        const pedidos = await obtenerPedidosSocket();
        io.emit("pedidos-actualizados", pedidos);
      } catch (error) {
        console.error("Error al crear pedido:", error.message);
      }
    });

    socket.on("eliminar-pedido", async (id) => {
      try {
        await eliminarPedido(id);
        const pedidos = await obtenerPedidosSocket();
        io.emit("pedidos-actualizados", pedidos);
      } catch (error) {
        console.error("Error al eliminar pedido:", error.message);
      }
    });

    socket.on("marcar-entregado", async (id) => {
      try {
        await marcarComoEntregado(id);
        const pedidos = await obtenerPedidosSocket();
        io.emit("pedidos-actualizados", pedidos);
      } catch (error) {
        console.error("Error al marcar pedido como entregado:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
