import { Dayoff, Employee, User} from "../Models/index.js"
import { Op } from "sequelize"
import employerServices from "./employerServices.js"
import Validator from "../Validators/Validator.js"

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

        const existDayOff = await Dayoff.findOne({
            where: {
                date: Validator.convertDate(date),
                [Op.or]: [
                    {employeeApprovedId: cpf},
                    {employeeRequestedId: cpf}
                ]
            }
        })

        console.log(existDayOff)

        if (existDayOff){
            existDayOff.employeeApprovedId = cpf
            await existDayOff.save()
            return existDayOff
        }

        const dayoff = await Dayoff.create({
            employeeApprovedId: cpf,
            date,
            justification
        })

        return dayoff
    }

    static async requestDayOff(data){
        const {username, date, justification} = data

        let {cpf} = data
        if (!cpf && ! username) throw new Error ('identify cpf or username')
        if (!cpf){
            const user = await User.findOne({
                attributes:['employeeId'],
                where: {
                    username
                }
            })
            cpf = user.employeeId
        }
        if (!cpf) throw new Error ('username incorrect . User dont exist or user role isnt employee')
        
        const dayoff = await Dayoff.create({
            employeeRequestedId: cpf,
            date,
            justification
        })

        return dayoff
    }

    static async getDayOffs(data){
        const {date, endDate, startDate, usernames, employerUsername, status} = data
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
        
        let dateQuery = date? Validator.convertDate(date): null
        
        if (!date && (endDate || startDate)){
            if (endDate) dateQuery = {...dateQuery, [Op.lt]: Validator.convertDate(endDate)}
            if (startDate) dateQuery = {...dateQuery, [Op.gte]: Validator.convertDate(startDate)}
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
            where,
            order: [
                ['date', 'ASC']
            ]
        })
        return dayOffs
    }

    static async updateDayOff(data){
        const {cpf, date, modifications} = data
        if (!cpf || !date) throw new Error("you must supply cpf or date")

        const dayoff = await Dayoff.update(modifications,{
            date,
            [Op.or]: [
                {employeeApprovedId: cpf},
                {employeeRequestedId: cpf}
            ]
        })

        return dayoff
    }
}

export default dayOffServices