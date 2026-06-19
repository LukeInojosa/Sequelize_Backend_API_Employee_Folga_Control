import { dayOffServices } from "../Services/index.js"

class dayOffController{
    static async getDayOffs(req, res,next){
        const {status} = req.params
        const {role, username} = req.user
        const {startDate, endDate, date} = req.query
        let dayOffs = null
        switch(role){
            case "employee":
                dayOffs = await dayOffServices.getDayOffs({
                    usernames: [username],
                    startDate,
                    endDate,
                    date,
                    status,
                })
                break;
            case "employer":
                const {usernames} = req.body
                dayOffs = await dayOffServices.getDayOffs({
                    usernames,
                    startDate,
                    endDate,
                    date,
                    employerUsername: username,
                    status,
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
        const userData = req.user
        const {date, justification} = req.body
        let dayOffCreated = null
        switch (userData?.role){
            case "employer":
                const {username} = req.body
                // verifica se já foi requisitado . Se já foi, atualiza para
                // folga dada. Se não foi , cria folga e dá a folga para o funcionário
                dayOffCreated = await dayOffServices.createDayOff({
                    username,
                    date,
                    justification
                })

                res.status(200).send(dayOffCreated)
                break;
            case "employee":
                // não deve ser possível o mesmo usuário 
                // fazer duas requisiçõs para o mesmo dia 
                dayOffCreated = await dayOffServices.requestDayOff({
                    username: userData?.username, 
                    date,
                    justification
                })
                res.status(200).send(dayOffCreated)
                break;
            default:
                res.status(401).send({
                    message: "user role dont exist"
                })
        }
    }

    static async deleteDayOff(req,res,next){

    }
    
    static async patchDayOff(){

    }
}

export default dayOffController