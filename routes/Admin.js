const express = require('express');
const {body} = require('express-validator');

const AdminController = require('../controllers/Admin');
const isAdmin = require('../MiddleWare/isAdmin');
const {IsAuth2} = require('./MiddleWare/isAuth');


const Router = express.Router();

Router.get('/users',IsAuth2,isAdmin,AdminController.getUsers);

Router.post('/users/edit/:userId',IsAuth2,isAdmin,[
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
],AdminController.editUser);

Router.delete('/user/delete/:userId',IsAuth2,isAdmin,AdminController.deleteUser);

Router.put('/user/changeRole/:userId/:CuserId',IsAuth2,AdminController.ChangeRole)



module.exports = Router;
