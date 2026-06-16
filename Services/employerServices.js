import { Employer, User, Employee } from "../Models/index.js";

class employerServices{
    static async createEmployer(data){
        const {cnpj, companyName} = data
        if (!cnpj || !companyName) throw new Error("Missing required fields for employer")
        
        const employer = await Employer.create({
            cnpj,
            companyName
        })

        if(!employer) throw new Error("Failed to create employer")
        return employer
    }

    static async getEmployerIdByUsername(username){
        const employer = await User.findOne({
            where: {
                username
            }
        }) 
        
        return employer?.employerId
    }
}

export default employerServices