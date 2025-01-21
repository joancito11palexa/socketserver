import {
  obtenerPlatos,
  crearPlato,
  eliminarPlato,
} from "../controllers/platosController.js";

export const conectarPlatosSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");
    obtenerPlatos().then((platos) =>
      socket.emit("platos-actualizados", platos)
    );
    // Crear nuevo plato
    io.on("crear-plato", async (nuevoPlato) => {
      console.log("ansd")
      await crearPlato(nuevoPlato);
      const platos = await obtenerPlatos();
      io.emit("platos-actualizados", platos);
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
};
