'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agrega la columna 'tags' a la tabla 'Bookmarks'
    await queryInterface.addColumn('Bookmarks', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING), // O el tipo que necesites (por ejemplo, TEXT si no es Postgres)
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remueve la columna 'tags' en caso de revertir la migración
    await queryInterface.removeColumn('Bookmarks', 'tags');
  }
};
