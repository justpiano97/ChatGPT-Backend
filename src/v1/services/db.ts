import * as dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();

const DB = new Sequelize((process.env.DB_NAME ?? ''), (process.env.DB_USER ?? ''), (process.env.DB_PASSWORD ?? ''), {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const testDBConnection = async () => {
  try {
    await DB.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { testDBConnection, DB };