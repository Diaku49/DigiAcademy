const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const IsAuth2 = async (req,res,next)=>{
    const Authentic = req.get('Authorization');
    try{
        //Auth header
        if(!Authentic){
            const error = new Error('not Athenticated.');
            error.statusCode = 401;
            throw error;
        }
        //validating token
        const token = req.headers.authorization.split(' ')[1];
        const Dtoken = jwt.verify(token, process.env.SecretKey)
        if(!Dtoken){
            const error = new Error('not Athenticated.');
            error.statusCode = 401;
            throw error;
        }
        // checking access
        let user = await  User.findOne({S_id:{googleid:Dtoken.id}});
        if(!user){
            user = await User.findOne({S_id:{gitHubid:Dtoken.id}});
            if(!user){
            const error = new Error('Didnt found the user.');
            error.statusCode = 404;
            throw error;
            }
        }
        if(!user.accessToken){
            const error = new Error('No token Available.');
            error.statusCode = 401;
            throw error;
        }
        req.user = user;
        next();
    }
    catch(err){
        if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
    }
}



module.exports = {
    IsAuth2: IsAuth2
};