import {DataTypes, Model} from 'sequelize';
import sequelize from './DatabaseConnection.js';

class Employer extends Model {}

Employer.init({
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        len: [3, 255]
    }
},{
    sequelize,
    modelName: "Employer",
    tableName: "employers",
    timestamps: false
})

export default Employer