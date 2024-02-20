const User = require('../models/User');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklistToken')
const ClearFile = require('../util/ClearFile');


exports.getUser = async (req,res,next)=>{
    try{
        const user = req.user;
        if(!user.email){
            user.email = ''
        }
        if(!user.avatar){
            user.avatar = ''
        }
        res.status(200).json({
            user:{
                name:user.name,
                email:user.email,
                role:user.role,
                avatar:user.avatar,
                OCourse:user.courseOwned,
                ECourse:user.courseEnrolled
            }
        })
    }
    catch(err){
    if(!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
    }
};


exports.editUser = async (req,res,next)=>{
    try{
        // validation
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
        }
        // finding user
        const user = req.user
        // check for pass
        if (req.body.password) {
            try{
            const newPass = await bcrypt.hash(req.body.password, 12);
            user.password = newPass;
            }
            catch(error){
                error = new Error('Hashing Pass failed.');
                error.statusCode = 500;
                throw error;
            }
        }
        // updating User Profile
        // checking avatar
        if(req.files){
            const fileA = req.files['image'].map(item=>{
                return item.path;
            });
            if(user.avatar !== ''){
                ClearFile(user.avatar);
            }
            user.avatar =  fileA[0];
        }
        user.name = req.body.name;
        user.email = req.body.email;
        const newUser = await user.save();
        res.status(200).json({
        message:'User edited.',
        user:newUser
        });
    }
    catch(err){
    if(!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
    }
}


exports.deleteUser = async (req,res,next)=>{
    try{
        const user = req.user
        await User.findByIdAndDelete(user._id);
        res.status(201).json({
            message:'black token added.',
        })
    }
    catch(err){
        if(!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
    }
}