import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

// Definir el modelo de Bookmark
const Bookmarks = sequelize.define('Bookmark', {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagen: {
      type: DataTypes.TEXT,  // Aquí usamos TEXT para almacenar la imagen en Base64
      allowNull: false
    }
  });

export default Bookmarks;
