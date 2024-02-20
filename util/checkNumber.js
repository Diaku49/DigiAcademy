const checkNumber = (value,{req})=>{
        if(0 >= value){
            const error = new Error('this number is not acceptable.');
            error.statusCode = 422;
            throw error
        }
        return true
    }


module.exports = checkNumber;