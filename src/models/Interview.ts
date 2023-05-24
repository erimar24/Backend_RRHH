import { DataTypes, Sequelize } from 'sequelize';
import { conn } from "../db/config";

export const Interview = conn.define(
  "Interview",
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    } 
  },
  {
    tableName: "interviews"
  }
);

Interview.sync({ force: false });