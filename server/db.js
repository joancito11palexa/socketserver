import { Sequelize, DataTypes } from 'sequelize';

// Configura la conexión a PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'dpg-ct1qvra3esus73d2hd1g-a', // Si usas una base de datos en la nube, cambia esto por la URL del host
  port: 5432, // Puerto por defecto de PostgreSQL
  username: 'restaurant_4q7p_user', // Tu usuario de PostgreSQL
  password: 'o4I3Qv5eQfIgG1IYTitg1CCbE59GtIj8', // Tu contraseña de PostgreSQL
  database: 'restaurant_4q7p', // Nombre de la base de datos
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
}, {
  timestamps: false,
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
