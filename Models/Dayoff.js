import { DataTypes, Model, Op } from "sequelize";
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
    },   
    employeeApprovedId: {
        type: DataTypes.STRING, 
    },
    employeeRequestedId: {
        type: DataTypes.STRING, 
    }
},{
    validate: {
        wasApprovedOrRequested() {
            if (this.employeeApprovedId == null && 
                this.employeeRequestedId == null
            ) throw new Error("dayoff must be approved or requested by someone")
        },

        async dayOffIsUnique(){
            const employeeId = this.employeeApprovedId? this.employeeApprovedId: this.employeeRequestedId
            const exist = await Dayoff.findOne({
                where: {
                    date: this.date,
                    [Op.or]: [
                        {employeeApprovedId: employeeId},
                        {employeeRequestedId: employeeId} 
                    ]
                }
            })

            if (exist && exist.id !== this.id){
                throw new Error('Exist a request or approved dayoff in this date for same user')
            }
        },

        requestedAndApprovedAreSame(){
            if(this.employeeRequestedId && this.employeeApprovedId &&
                (this.employeeApprovedId != this.employeeRequestedId)
            ) throw new Error("the approver Id must be same than Requester Id")
        }

    },
    sequelize, 
    modelName: "Dayoff",
    tableName: "dayoffs",
    timestamps: true,
})

export default Dayoff