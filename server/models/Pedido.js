// models/Pedido.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Cliente } from "./Cliente.js"; // Importamos el modelo Cliente

export const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente",
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    clienteId: {
      // Añadimos la relación con Cliente
      type: DataTypes.INTEGER,
      references: {
        model: Cliente,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Establecer la relación: un Pedido pertenece a un Cliente
Pedido.belongsTo(Cliente, { foreignKey: "clienteId" });
