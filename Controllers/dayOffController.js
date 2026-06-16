import { dayOffServices } from "../Services/index.js"

class dayOffController{
    static async getDayOffs(req, res,next){
        const {role, username} = req.user
        const {startDate, endDate, date} = req.query
        let dayOffs = null
        switch(role){
            case "employee":
                dayOffs = await dayOffServices.getDayOffs({
                    usernames: [username],
                    startDate,
                    endDate,
                    date
                })
                break;
            case "employer":
                const {usernames} = req.body
                dayOffs = await dayOffServices.getDayOffs({
                    usernames,
                    startDate,
                    endDate,
                    date,
                    employerUsername: username
                })
                break;
            default:
                res.status(401).send({
                    message: "user role dont exist"
                })
        }

        res.status(200).send(dayOffs)
    }
    static async createDayOff(req,res,next){
        const {role} = req.user
        switch (role){
            case "employer":
                const {username, date, justification} = req.body

                const dayOffCreated = await dayOffServices.createDayOff({
                    username,
                    date,
                    justification
                })

                res.status(200).send(dayOffCreated)
                break;
            case "employee":
                break;
            default:
                res.status(401).send({
                    message: "user role dont exist"
                })
        }
    }
    static async deleteDayOff(){

    }
    static async patchDayOff(){

    }
}

export default dayOffController