import { Dayoff, Employee, User} from "../Models/index.js"
import { Op } from "sequelize"
import employerServices from "./employerServices.js"

class dayOffServices{
    static async createDayOff(data){
        const {username, date, justification} = data
        let {cpf} = data
        if (!cpf && ! username) throw new Error ('identify cpf or username')
        if (!cpf){
            const employee = await User.findOne({
                attributes:['employeeId'],
                where: {
                    username
                }
            })
            cpf = employee.employeeId
        }
        if (!cpf) throw new Error ('username incorrect . User dont exist or user role isnt employee')
        
        const dayOff = await Dayoff.create({
            employeeApprovedId: cpf,
            date,
            justification
        })

        return dayOff
    }

    static async requestDayOff(data){
        const {username, date, justification} = data
        let {cpf} = data
        if (!cpf && ! username) throw new Error ('identify cpf or username')
        if (!cpf){
            cpf = await User.findOne({
                attributes:['employeeId'],
                where: {
                    username
                }
            }).employeeId
        }
        if (!cpf) throw new Error ('username incorrect . User dont exist or user role isnt employee')
        
        const dayOff = await Dayoff.create({
            employeeRequestedId: cpf,
            date,
            justification
        })

        return dayOff
    }

    static async getDayOffs(data){
        const {date, endDate, startDate, usernames, employerUsername} = data

        let where = {}
        if (employerUsername) {
            const employerId = await employerServices.getEmployerIdByUsername(employerUsername)
            where = {
                employerId
            }
        }

        const users = await User.findAll({
            attributes: ['employeeId'],
            where: usernames? {
                username: usernames
            }: {},
            include:{
                model: Employee,
                where
            }
        })
        const employeeIds = users.map(user => user.employeeId)
        
        let dateQuery = date? date: null

        if (!date && (endDate || startDate)){
            dateQuery = {
                [Op.lt]: endDate,
                [Op.gt]: startDate
            }
        }

        where = {}
        if (dateQuery) where.date = dateQuery
        if (employeeIds) where = {
            ...where,
            [Op.or]:[
                {employeeApprovedId:employeeIds},
                {employeeRequestedId:employeeIds}
            ]
        }

        const dayOffs = await Dayoff.findAll({
            where
        })
        return dayOffs
    }
}

export default dayOffServices