const express = require('express');

const CourseController = require('../controllers/Course');
const {body,check} = require('express-validator');
const checkNumber = require('../util/checkNumber');


const Router = express.Router();

Router.get('/Courses',CourseController.getCourses);

Router.get('/Courses/:courseId',CourseController.viewCourse);

Router.post('/Create',[
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

Router.put('/edit:courseId',[
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

Router.delete('/delete:couseId',CourseController.DeleteCourse);

Router.get('/Courses/Search',CourseController.search);

module.exports = Router;