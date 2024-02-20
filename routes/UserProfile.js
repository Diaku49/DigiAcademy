const express = require('express');

const UserProfileController = require('../controllers/UserProfile')
const {body,check} = require('express-validator');
const {IsAuth2} = require('./MiddleWare/isAuth');

const Router = express.Router();

//getUser
Router.get('/info',IsAuth2,UserProfileController.getUser);

//Edit UserProfile
Router.put('/edit',IsAuth2,[
    //email
    body('email')
    .isEmail()
    .withMessage("Email not Valid."),
    //name
    body('name')
    .trim()
    .isLength({min:5})
    .withMessage('Name is empty or not enough characters.'),
    //pass
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Pass is not long enough.')
    ],UserProfileController.editUser);

Router.delete('/delete',IsAuth2,UserProfileController.deleteUser)



module.exports = Router