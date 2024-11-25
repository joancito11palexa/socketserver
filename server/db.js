import { Sequelize, DataTypes } from 'sequelize';

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

const Plato = sequelize.define("Plato", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING, // URL de la imagen del plato
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM,
    values: ['entrada', 'platoPrincipal'], // Se definen los valores posibles
    allowNull: false, // No permite valores nulos
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

    // Sincronizar los modelos con la base de datos (force: true elimina las tablas existentes)
    await sequelize.sync({ force: true});
    console.log('Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
  }
})();

export { Pedido, Plato };
