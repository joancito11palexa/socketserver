import { Pedido } from "../models/index.js";

export const obtenerPedidos = async () => {
  try {
    return await Pedido.findAll();
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
  }
};

export const crearPedido = async (descripcion, clienteId) => {
  try {
    // Calcular el total
    const total =
      // Sumar todos los platos principales
      descripcion.platoPrincipal.reduce(
        (acc, plato) => acc + plato.precio * plato.cantidad,
        0
      ) +
      // Sumar todas las entradas
      descripcion.entradas.reduce(
        (acc, entrada) => acc + entrada.precio * entrada.cantidad,
        0
      );

    // Crear el pedido y asociarlo con un cliente específico
    const nuevoPedido = await Pedido.create({
      descripcion, // Guardamos la descripción completa
      total, // El total calculado
      clienteId, // Asociamos el pedido al cliente proporcionado
    });

    console.log(descripcion); // Verifica la descripción
    console.log(nuevoPedido); // Verifica el objeto pedido creado
    return nuevoPedido;
  } catch (error) {
    console.error("Error creando el pedido:", error);
    throw error;
  }
};

export const eliminarPedido = async (id) => {
  try {
    await Pedido.destroy({ where: { id } });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
  }
};

export const marcarComoEntregado = async (id) => {
  try {
    const pedido = await Pedido.findByPk(id);
    if (pedido && pedido.estado !== "entregado") {
      pedido.estado = "entregado";
      await pedido.save();
    }
  } catch (error) {
    console.error("Error al marcar como entregado:", error);
  }
};
