import {
  obtenerPedidos,
  crearPedido,
  eliminarPedido,
  marcarComoEntregado,
  obtenerPedidosSocket,
} from "../controllers/pedidosController.js";

export const conectarPedidosSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    try {
      // Enviar pedidos iniciales al cliente conectado
      const pedidos = await obtenerPedidosSocket();
      socket.emit("pedidos-actualizados", pedidos);
    } catch (error) {
      console.error("Error al enviar pedidos iniciales:", error.message);
    }

    // Escuchar "nuevo-pedido" en el socket específico
    socket.on("nuevo-pedido", async (descripcion) => {
      try {
        await crearPedido(descripcion);
        const pedidos = await obtenerPedidosSocket();
        io.emit("pedidos-actualizados", pedidos); // Actualizar a todos los clientes conectados
        console.log("io.emit pedidos-actualizados EJECUTADO")
      } catch (error) {
        console.error("Error al procesar el pedido:", error.message);
        socket.emit("error-pedido", { message: error.message });
      }
    });

    // Escuchar "eliminar-pedido" en el socket específico
    socket.on("eliminar-pedido", async (id) => {
      try {
        await eliminarPedido(id);
        const pedidos = await obtenerPedidosSocket();
        io.emit("pedidos-actualizados", pedidos);
      } catch (error) {
        console.error("Error al eliminar pedido:", error.message);
      }
    });

    // Escuchar "marcar-entregado" en el socket específico
    socket.on("marcar-entregado", async (id) => {
      try {
        await marcarComoEntregado(id);
        const pedidos = await obtenerPedidosSocket();
        io.emit("pedidos-actualizados", pedidos);
      } catch (error) {
        console.error("Error al marcar pedido como entregado:", error.message);
      }
    });

    // Manejar la desconexión del cliente
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
