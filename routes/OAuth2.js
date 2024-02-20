const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport')
require('../MiddleWare/PassportConfig');
const AuthController = require("../controllers/auth");
const {IsAuth2} = require('../MiddleWare/isAuth')



const Router = express.Router();

// GitHub OAuth
Router.get('/github',passport.authenticate('github',{scope: ['profile','email'],session:false}));

Router.get('/github/callback',
passport.authenticate('github',{ failureRedirect: '/login',session:false}),
    async(req, res)=>{
try{
    const { user, token } = req.user;
    let newuser = await User.findOne({S_id:{
        gitHubid:user.id
    }})
    if(!newuser){
        newuser = new User({
            name:user.username,
            S_id:{
                gitHubid:user.id
            },
            email:user.email,
            role:'normal',
            accessToken:user.accessToken
        })
        await newuser.save();
    }
    res.status(200).json({
        Message:'got signed up.',
        token:token
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
})

// google OAuth
Router.get('/google',passport.authenticate("google",
    { scope: ['profile','email'],session:false}));

Router.get('/google/callback',
passport.authenticate("google",{failureRedirect:"/login",session:false},),
    async(req,res)=>{
try{
    const { user, token } = req.user;
    let newuser = await User.findOne({S_id:{
        googleid:user.id
    }})
    if(!newuser){
        newuser = new User({
            name:user.username,
            S_id:{
                googleid:user.id
            },
            email:user.email,
            role:'normal',
            accessToken:user.accessToken
        })
        await newuser.save();
    }
    res.status(200).json({
        Message:'got signed up.',
        token:token
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
});

Router.post('/logout',IsAuth2,AuthController.Logout);


module.exports = Router