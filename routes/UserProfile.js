const express = require('express');

const UserProfileController = require('../controllers/UserProfile')
const {body,check} = require('express-validator');

const Router = express.Router();

//getUser
Router.get('/info',UserProfileController.getUser);

//Edit UserProfile
Router.put('/edit',[
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

Router.delete('/delete',UserProfileController.deleteUser)



module.exports = Router