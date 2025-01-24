import {
  obtenerPedidosSocket,
  crearPedido,
  eliminarPedido,
  marcarComoEntregado,
} from "../controllers/pedidosController.js";

export const conectarPedidosSocket = (io, socket) => {
  // Enviar datos iniciales al cliente al conectarse
  const enviarPedidosIniciales = async () => {
    try {
      const pedidos = await obtenerPedidosSocket();
      socket.emit("pedidos-actualizados", pedidos); // Envía los datos iniciales al cliente conectado
    } catch (error) {
      console.error("Error al enviar pedidos iniciales:", error.message);
    }
  };

  // Llamar a la función al conectar el cliente
  enviarPedidosIniciales();

  // Manejo de eventos específicos
  socket.on("nuevo-pedido", async (descripcion) => {
    try {
      await crearPedido(descripcion);
      const pedidos = await obtenerPedidosSocket();
      io.emit("pedidos-actualizados", pedidos); // Notifica a todos los clientes
    } catch (error) {
      console.error("Error al procesar el pedido:", error.message);
      socket.emit("error-pedido", { message: error.message });
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
};
