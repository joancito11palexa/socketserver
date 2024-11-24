import { Sequelize, DataTypes } from 'sequelize';

// Configuración de la conexión a PostgreSQL
const sequelize = new Sequelize('postgresql://restaurant_4q7p_user:o4I3Qv5eQfIgG1IYTitg1CCbE59GtIj8@dpg-ct1qvra3esus73d2hd1g-a.oregon-postgres.render.com/restaurant_4q7p', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // Desactiva el registro de consultas, opcional
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
  imagen: {
    type: DataTypes.STRING, // URL de la imagen
    allowNull: true,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false, // Si no necesitas las columnas `createdAt` y `updatedAt`
});

// Conectar y sincronizar la base de datos
(async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');

    // Sincronizar el modelo con la base de datos (esto crea la tabla si no existe)
    await sequelize.sync(); 
    console.log('Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
  }
})();

export { Pedido };
