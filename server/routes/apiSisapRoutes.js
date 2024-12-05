import express from 'express';
import { obtenerListaProductos, obtenerPrecio } from '../controllers/apiSisapControllers.js';

const router = express.Router();

router.get('/obtener-lista-productos', obtenerListaProductos);
router.post('/obtener-precio', obtenerPrecio);

export default router;
