import { DataTypes, Model } from "sequelize";
import sequelize from "./DatabaseConnection.js";

class Dayoff extends Model {}

Dayoff.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    justification:{
        type: DataTypes.TEXT,
        defaultValue: null
    }
},{
    sequelize, 
    modelName: "Dayoff",
    tableName: "dayoffs",
    timestamps: true
})

export default Dayoff