import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.JSON, // Guardará la descripción como un objeto JSON
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
      defaultValue: DataTypes.NOW, // Guarda automáticamente la fecha de creación
    },
  },
  {
    timestamps: false,
  }
);

export default Pedido;
