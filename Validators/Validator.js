class Validator{
    static convertDate(date){
        const [day,moth,year] = date.trim()
                                .split('-')
                                .map(v => Number(v))
        return new Date(year,moth-1,day)
    }
}


export default Validator