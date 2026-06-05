import { Employer } from "../Models/index.js";

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
}

export default employerServices