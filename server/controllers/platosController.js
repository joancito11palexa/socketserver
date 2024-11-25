import { Plato } from '../models/index.js';

export const obtenerPlatos = async () => {
  try {
    return await Plato.findAll();
  } catch (error) {
    console.error("Error al obtener platos:", error);
  }
};

export const crearPlato = async (nuevoPlato) => {
  try {
    return await Plato.create(nuevoPlato);
  } catch (error) {
    console.error("Error al crear plato:", error);
  }
};

export const eliminarPlato = async (id) => {
  try {
    await Plato.destroy({ where: { id } });
  } catch (error) {
    console.error("Error al eliminar plato:", error);
  }
};
