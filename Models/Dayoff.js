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
        allowNull: false,
        set(value) {
            const [day, moth, year] = value
                        .trim()
                        .split('-')
                        .map(v => Number(v))
            if (!day || !moth || !year) throw new Error("date column must be a date in format dd-mm-yyyy in Dayoff model")
            this.setDataValue('date', 
                new Date(year, moth-1, day)
            )
        }
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