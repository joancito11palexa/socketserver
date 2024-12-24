import express from "express";
import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidosEntregados,
  obtenerPedidosPorCliente,
} from "../controllers/pedidosController.js";

const router = express.Router();
router.get("/pedidos", obtenerPedidos);
router.get("/pedidos/:clienteId/pedidosCliente", obtenerPedidosPorCliente);
router.get(
  "/pedidos/:clienteId/pedidosClienteEntregados",
  obtenerPedidosEntregados
);
router.post("/pedidos/:clienteId/crear", crearPedido);
export default router;
