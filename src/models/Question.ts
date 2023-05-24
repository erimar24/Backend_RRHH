import { DataTypes } from "sequelize";
import { conn } from "../db/config";
import { Position } from "./Position";

export const Question = conn.define(
    "Question",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        },
    },
    {
        tableName: "questions"
    }
);

Question.belongsTo(Position,
{foreignKey: "positionId"});

Question.sync({ force: false });