import { Pedido } from '../models/index.js';

export const obtenerPedidos = async () => {
  try {
    return await Pedido.findAll();
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
  }
};

export const crearPedido = async (plato, imagen, precio) => {
  try {
    return await Pedido.create({ plato, imagen, precio, estado: 'pendiente' });
  } catch (error) {
    console.error("Error al crear nuevo pedido:", error);
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
