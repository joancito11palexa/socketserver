// models/Cliente.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Cliente = sequelize.define("Cliente", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,  // No generamos los campos createdAt y updatedAt
});


