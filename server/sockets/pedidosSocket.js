import { obtenerPedidos, crearPedido, eliminarPedido, marcarComoEntregado } from '../controllers/pedidosController.js';

export const conectarPedidosSocket = (io) => {

  io.on("connection", (socket) => {



    console.log("Cliente conectado");


    obtenerPedidos().then((pedidos) => socket.emit("pedidos-actualizados", pedidos));
    
    
    socket.on("nuevo-pedido", async (descripcion) => {
      await crearPedido(descripcion);
      const pedidos = await obtenerPedidos();
      io.emit("pedidos-actualizados", pedidos);
    });

  
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
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
