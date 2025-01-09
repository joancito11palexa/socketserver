import { Sequelize } from 'sequelize';

// Configuración de la base de datos
const sequelize = new Sequelize(
  "postgresql://restaurant_fk9u_user:N680EkpNCOXMAeT6vy8NrHLtUS7TCYT4@dpg-ctmnj2rv2p9s73fd9lp0-a.oregon-postgres.render.com/restaurant_fk9u",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false, // Evita mostrar las consultas SQL en la consola
  }
);

export default sequelize;
