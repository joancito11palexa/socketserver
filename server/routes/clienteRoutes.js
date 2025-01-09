import express from "express";
import {
  crearOActualizarCliente,
  obtenerClientes,
  obtenerClienteAutenticado,
  eliminarCliente,
  obtenerCliente,
} from "../controllers/clienteController.js";
import { checkJwt } from "../middlewares/auth0Middleware.js";
import { checkAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Crear o actualizar cliente (autenticado)
router.post("/clientes/auth0", checkJwt, crearOActualizarCliente);
router.get("/cliente/:id", obtenerCliente);
// Obtener todos los clientes (solo administradores)
router.get("/clientes", obtenerClientes);

// Obtener cliente autenticado
router.get("/cliente", checkJwt, obtenerClienteAutenticado);

// Eliminar cliente por ID (solo administradores)
router.delete("/clientes/:id", checkJwt, checkAdmin, eliminarCliente);

export default router;
