import { DataTypes, Model } from "sequelize";
import sequelize from "./DatabaseConnection.js";

class Employee extends Model {}

Employee.init({
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        len: [3, 255]
    }
},{
    sequelize,
    modelName: "Employee",
    tableName: "employees",
    timestamps: false
})

export default Employee