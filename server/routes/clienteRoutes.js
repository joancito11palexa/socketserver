import express from 'express';
import { crearCliente, obtenerClientes, obtenerClientePorId, eliminarCliente, iniciarSesion } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/clientes', crearCliente);  // Crear un cliente
router.post('/login', iniciarSesion);
router.get('/clientes', obtenerClientes);  // Obtener todos los clientes
router.get('/clientes/:id', obtenerClientePorId);  // Obtener un cliente por ID
router.delete('/clientes/:id', eliminarCliente);  // Eliminar un cliente

export default router;
