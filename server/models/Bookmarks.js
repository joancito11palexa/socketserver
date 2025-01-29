import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

// Definir el modelo de Bookmark
const Bookmarks = sequelize.define('Bookmarks', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        }
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true, // Si deseas registrar fecha de creación y actualización
});

export default Bookmarks
