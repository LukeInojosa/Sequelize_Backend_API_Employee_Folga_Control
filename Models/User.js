import { DataTypes, Model } from "sequelize";
import sequelize from "./DatabaseConnection.js";

class User extends Model {}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: "User", // nome do modelo que será usado para referenciar a tabela. Ex: sequelize.models.User
    tableName: "users", // nome da tabel a ser criada no banco de dados
    timestamps: false // desabilita os campos createdAt e updatedAt
})

export default User