import {User, Employee, Employer} from "../Models/index.js";
import {employeeServices} from "../Services/index.js";
import {employerServices} from "../Services/index.js";
import bcrypt from "bcryptjs";

class userServices{
    static async createEmployerUser(data){
        const {username, password, cnpj} = data
        if (!username || !password) throw new Error("Missing required fields for user")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            password: hashedPassword,
            employerId: cnpj
        })
        if(!user) throw new Error("Failed to create user")
        return user
    }

    static async createEmployeeUser(data){
        const {username,password,cpf} = data
        
        if (!username || !password) throw new Error("Missing required fields username or password for user")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            password: hashedPassword,
            employeeId: cpf
        })
        if(!user) throw new Error("Failed to create user")
        return user
    }

    static async getAllUsers(data){
        return await User.findAll({
            include: [
                {model: Employee},
                {model: Employer}
            ]
        })
    }

    static async createUser(data){
        const {role} = data
        let user = null;
        if (role === "employee"){
            const {cpf, name, cnpj, companyName} = data
            const employee = await employeeServices.createEmployee({cpf,name,cnpj,companyName})

            const {username,password} = data
            user = await userServices.createEmployeeUser({
                username,
                password,
                cpf: employee.cpf
            })

        }else if(role === "employer"){

            const {cnpj, companyName} = data
            const employer = await employerServices.createEmployer({cnpj,companyName})

            const {username,password} = data
            user = await userServices.createEmployerUser({
                username,
                password, 
                cnpj: employer.cnpj
            })

        }else {
            throw new Error("Invalid role")
        }

        if(!user) throw new Error("Failed to create user")
        return user
    }


}

export default userServices