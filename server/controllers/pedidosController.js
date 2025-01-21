import { Cliente, Pedido } from "../models/index.js";

export const obtenerPedidos = async (req, res) => {
  try {
    // Obtener todos los pedidos
    const pedidos = await Pedido.findAll({
      order: [["fecha", "DESC"]], // Opcional: ordenar por fecha de forma descendente
    });

    // Verificar si hay pedidos
    if (!pedidos.length) {
      return res.status(404).json({ message: "No se encontraron pedidos." });
    }

    // Devolver los pedidos
    return res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return res.status(500).json({ message: "Error al obtener los pedidos." });
  }
};
export const obtenerPedidosSocket = async () => {
  try {
    const pedidos = await Pedido.findAll({
      order: [["fecha", "DESC"]],
    });
    return pedidos;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    throw new Error("Error al obtener los pedidos");
  }
};

export const obtenerPedidosPorCliente = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const pedidosPendientes = await Pedido.findAll({
      where: {
        clienteId,
      },
      order: [["fecha", "DESC"]],
    });

    // if (!pedidosPendientes.length) {
    //   return res.status(404).json({ message: "No tienes pedidos pendientes." });
    // }

    res.json(pedidosPendientes);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener los pedidos." });
  }
};

export const obtenerPedidosEntregados = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const pedidosEntregados = await Pedido.findAll({
      where: {
        clienteId,
        estado: "entregado", // Filtrar solo pedidos pendientes
      },
      order: [["fecha", "DESC"]],
    });

    // if (!pedidosEntregados.length) {
    //   return res.status(404).json({ message: "No hay pedidos entregados." });
    // }

    res.json(pedidosEntregados);
  } catch (error) {
    console.error("Error al obtener pedidos entregados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los pedidos entregados." });
  }
};

export const crearPedido = async (clienteId, entradas, platoPrincipal) => {
  try {
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res
        .status(404)
        .json({ message: `Cliente con ID ${clienteId} no encontrado.` });
    }
    const total =
      entradas.reduce(
        (acc, entrada) => acc + entrada.precio * entrada.cantidad,
        0
      ) +
      platoPrincipal.reduce(
        (acc, plato) => acc + plato.precio * plato.cantidad,
        0
      );

    const nuevoPedido = await Pedido.create({
      descripcion: { entradas, platoPrincipal },
      total,
      clienteId,
    });

    res.status(201).json({
      message: "Pedido creado exitosamente.",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({
      message: "Ocurrió un error al intentar crear el pedido.",
      error: error.message,
    });
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
