import { obtenerPlatos, crearPlato, eliminarPlato } from "../controllers/platosController.js";

export const conectarPlatosSocket = (io, socket) => {
  obtenerPlatos().then((platos) => socket.emit("platos-actualizados", platos));

  socket.on("crear-plato", async (nuevoPlato) => {
    try {
      await crearPlato(nuevoPlato);
      const platos = await obtenerPlatos();
      io.emit("platos-actualizados", platos);
    } catch (error) {
      console.error("Error al crear plato:", error.message);
    }
  });

  socket.on("eliminar-plato", async (id) => {
    try {
      await eliminarPlato(id);
      const platos = await obtenerPlatos();
      io.emit("platos-actualizados", platos);
    } catch (error) {
      console.error("Error al eliminar plato:", error.message);
    }
  });
};
