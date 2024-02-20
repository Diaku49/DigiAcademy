const User = require('../models/User');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklistToken')

//Signup

exports.Singup = async (req,res,next)=>{
    const errors = validationResult(req);
    try{
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const isEqual = await User.findOne({email:email})
    if(isEqual){
        const error = new Error('Email already exist.');
        error.statusCode = 409;
        throw error;
    }
    const password = await bcrypt.hash(req.body.password,12);
    const user = new User({
        name:req.body.name,
        email:email,
        password:password,
        role:req.body.role,
        courseEnrolled:[],
        courseOwned:[]
    });
    const newuser = await user.save();
    res.status(201).json({
        message:'user signed up.',
        user:newuser._id
    })
}
    catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
    };
}

//Login

exports.Login = async (req,res,next)=>{
    const errors = validationResult(req);
    try{
    if(!errors.isEmpty()){
        const error = new Error;
        error.statusCode = 422;
        error.data = errors.array();
    };
    const email = req.body.email;
    // check existing user
    const user = await User.findOne({email:email})
    if(!user){
        const error = new Error('Email dont Exist.');
        error.statusCode = 409;
        throw error;
    };
    //check pass
    const isEqual = bcrypt.compare(req.body.password,user.password)
    if(!isEqual){
        const error = new Error('Password Doesnt match.');
        error.statusCode = 409;
        throw error;
    }
    const token = jwt.sign({
        role:user.role,
        userId:user._id.toString(),
    },process.env.SecretKey,{ expiresIn: '1h'});

    res.status(200).json({
        message:'loged In',
        token:token
    })
    }
    catch(err){
        if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
    };
}

exports.Logout = async (req,res,next)=>{
    try{
        const user = req.user;
        user.accessToken = null;
        await user.save()
        res.status(201).json({
            message:'User loged out.',
        })
    }
    catch(err){
        if(!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
    }
}