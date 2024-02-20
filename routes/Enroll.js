const express = require('express');

const EnrollController = require('../controllers/Enroll');
const {IsAuth2} = require('./MiddleWare/isAuth');



const Router = express.Router();

Router.get('/userEnrolls',IsAuth2,EnrollController.userEnrolls);

Router.post('/Euser:courseId',IsAuth2,EnrollController.Enroll);

Router.post('/URuser',IsAuth2,EnrollController.Unroll)


module.exports = Router;
