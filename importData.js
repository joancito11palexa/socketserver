import { readFile } from 'fs/promises';
import Pedido from './server/models/Pedido.js';

// Ruta completa del archivo JSON
const filePath = 'D:/escritorio/AUTODIDACTA/Proyectos/resturantemm/backend/data/pedidos_noviembre_13_22.json';

// Función para importar los pedidos
const importarPedidos = async () => {
  try {
    // Leer el archivo JSON de manera asincrónica
    const data = await readFile(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    // Insertar los pedidos en la base de datos
    await Pedido.bulkCreate(pedidos);
    console.log('Pedidos importados correctamente!');
  } catch (error) {
    console.error('Error al importar los pedidos:', error);
  }
};

// Llamar a la función para importar
importarPedidos();
