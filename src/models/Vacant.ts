import { DataTypes } from "sequelize";
import { conn } from "../db/config";
import { Position } from "./Position";

export const Vacant = conn.define(
    "Vacant",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        vacancy_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "vacants",
    }
);

Vacant.belongsTo(Position,
{foreignKey: "positionId"});

Vacant.sync({ force: false});