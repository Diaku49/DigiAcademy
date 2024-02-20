const User = require('../models/User')

const isAdmin = async (req,res,next)=>{
try{
    const user = req.user
    if(user.role !== 'admin'){
        const error = new Error('Not Admin');
        error.statusCode = 403;
        throw error;
    }
    next(user);
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

module.exports = isAdmin;