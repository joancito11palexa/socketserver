import { Sequelize, DataTypes } from 'sequelize';

// Configura la conexión a PostgreSQL usando la URL externa de Render
const sequelize = new Sequelize('postgresql://restaurant_4q7p_user:o4I3Qv5eQfIgG1IYTitg1CCbE59GtIj8@dpg-ct1qvra3esus73d2hd1g-a.oregon-postgres.render.com/restaurant_4q7p', {
  dialect: 'postgres',
  logging: false, // Desactivar el logging para no mostrar las consultas en consola (opcional)
});

// Definir el modelo de Pedido
const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  plato: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente',
  },
  imagen: { // Campo para la URL de la imagen del plato
    type: DataTypes.STRING, // Almacena la URL de la imagen
    allowNull: true, // Puede ser opcional
  },
  precio: { // Campo para el precio del plato
    type: DataTypes.FLOAT, // Usamos float para precios decimales
    allowNull: false, // No debería ser nulo
  }
}, {
  timestamps: false, // Si no necesitas las columnas de timestamps
});

// Conectar a la base de datos y sincronizarla
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos PostgreSQL establecida con éxito.');
    await sequelize.sync(); // Esto crea la tabla si no existe
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
})();

export { Pedido };
