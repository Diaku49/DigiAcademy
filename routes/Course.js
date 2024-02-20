const express = require('express');

const CourseController = require('../controllers/Course');
const {body,check} = require('express-validator');
const checkNumber = require('../util/checkNumber');
const {IsAuth2} = require('./MiddleWare/isAuth');


const Router = express.Router();

Router.get('/Courses',IsAuth2,CourseController.getCourses);

Router.get('/Courses/:courseId',IsAuth2,CourseController.viewCourse);

Router.post('/Create',IsAuth2,[
    body('title')
    .trim()
    .isLength({min:4})
    .withMessage('invalid Title'),
    body('description')
    .isLength({min:8})
    .withMessage('invalid description'),
    body('price')
    .isNumeric()
    .withMessage('Not a number')
    .custom(checkNumber),
    body('totalHour')
    .isNumeric()
    .withMessage('Not a number')
    .custom(checkNumber)
],CourseController.CreateCourse);

Router.put('/edit:courseId',IsAuth2,[
    body('title')
    .trim()
    .isLength({min:4})
    .withMessage('invalid Title'),
    body('description')
    .isLength({min:8})
    .withMessage('invalid description'),
    body('price')
    .isNumeric()
    .withMessage('Not a number')
    .custom(checkNumber),
    body('totalHour')
    .isNumeric()
    .withMessage('Not a number')
    .custom(checkNumber)
],CourseController.EditCourse);

Router.delete('/delete:couseId',IsAuth2,CourseController.DeleteCourse);

Router.get('/Courses/Search',IsAuth2,CourseController.search);

module.exports = Router;