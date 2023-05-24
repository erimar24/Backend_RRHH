import { Sequelize } from "sequelize";
import { Sequelize as st } from "sequelize/types/sequelize";
import mysql2 from 'mysql2';
import dotenv from "dotenv";
dotenv.config();

export const conn: st = new Sequelize(
  process.env.DATABASE as string,
  process.env.USER as string,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    dialectModule: mysql2,
    port: Number(process.env.DB_PORT ?? undefined),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
