const express = require('express');
const AuthController = require('../controllers/auth');
const {check,body} = require('express-validator');



const Router = express.Router();


Router.post('/signup',[
    //email
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage("Email not Valid."),
    //name
    body('name')
    .isLength({min:5})
    .notEmpty()
    .withMessage('Name is empty or not enough characters.').trim(),
    //pass
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Pass is not long enough.')
    .isAlphanumeric(),
    //confirmPassword
    body('confirmPassword')
    .trim()
    .custom((value,{req})=>{
        if(value !== req.body.password){
            const error = new Error('Mismatched password')
            error.statusCode = 422;
            throw error;
        }
        return true
    }),
    //Role
    body('role')
    .trim()
    .notEmpty()
    .withMessage('role is not Valid.')
],AuthController.Singup);


Router.post('/login',[
    //email
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage("Email not Valid."),
    //pass
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Pass is not long enough.')
],AuthController.Login)


Router.post('/logout',AuthController.Logout);


module.exports = Router