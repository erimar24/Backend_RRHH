import { DataTypes } from "sequelize";
import { conn } from "../db/config";
import { Vacant } from "./Vacant";
import { Candidate } from "./Candidate";

export const Evaluation = conn.define(
    "Evaluation",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fa_level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fa_ability: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exp_general: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exp_spicify: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        interview: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tecnhinal_test: {
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
        tableName: "evaluations"
    }
);

Evaluation.belongsTo(Vacant,
{foreignKey: "vacantId"});
Evaluation.belongsTo(Candidate,
{foreignKey: "candidateId"});

Evaluation.sync({ force: false });