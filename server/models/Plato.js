import { DataTypes } from "sequelize";
import sequelize from '../config/db.js'; // Importamos sequelize desde la configuración

export const Plato = sequelize.define('Plato', {
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
    values: ["entrada", "platoPrincipal"], // Se definen los valores posibles
    allowNull: false,
  },
}, {
  timestamps: false, // No generar columnas `createdAt` y `updatedAt`
});

