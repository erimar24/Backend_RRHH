import { DataTypes } from "sequelize";
import { conn } from "../db/config";
import { Position } from "./Position";

export const Candidate = conn.define(
    "Candidate",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        phone: {
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
        cv: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        place: {
            type: DataTypes.STRING,
            allowNull: false
        },
        job_application: { 
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
        tableName: "candidates"
    }
); 

Candidate.belongsTo(Position,
    {foreignKey: "positionId"}
);

Candidate.sync({ force: false });