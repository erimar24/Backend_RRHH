import { DataTypes } from "sequelize";
import { conn } from "../db/config";

export const Position = conn.define(
    "Position",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        career: {
            type: DataTypes.STRING,
            allowNull: false
        },
        academic_level: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    { 
        tableName: "Positions",
    }
);

Position.sync({ force: false });