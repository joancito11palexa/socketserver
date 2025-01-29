import { Sequelize } from "sequelize";


// Configurar Sequelize
const sequelize = new Sequelize('postgresql://restaurantt_user:Z6BAnZvbILnuQFaZ4G0v0tw6Zxqtb2DU@dpg-cud3b7hopnds73aovaqg-a.oregon-postgres.render.com/restaurantt', {
  dialect: 'postgres',
  dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false,
      },
  },
  logging: false,
});

export default sequelize;
