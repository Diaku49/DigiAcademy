const express = require('express');

const EnrollController = require('../controllers/Enroll');



const Router = express.Router();

Router.get('/userEnrolls',EnrollController.userEnrolls);

Router.post('/Euser:courseId',EnrollController.Enroll);

Router.post('/URuser',EnrollController.Unroll)


module.exports = Router;
