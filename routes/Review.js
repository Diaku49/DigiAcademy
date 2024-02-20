const express = require('express');

const ReviewController = require('../controllers/Review');
const {body} = require('express-validator');
const {IsAuth2} = require('./MiddleWare/isAuth');




const Router = express.Router();

Router.get('/reviews/:courseId',IsAuth2,ReviewController.CReview);

Router.post('/add/review/:courseId',IsAuth2,[
    body('rating')
    .isInt({min:1,max:100})
    .withMessage('not a number'),
    body('comment')
    .isLength({min:7})
    .withMessage('not Enough Characters.')
],ReviewController.AddingReview);

Router.put('/edit/review/:reviewId',IsAuth2,[
    body('rating')
    .isInt({min:1,max:100})
    .withMessage('not a number'),
    body('comment')
    .isLength({min:7})
    .withMessage('not Enough Characters.')
],ReviewController.editReview);

Router.delete('/delete/:courseId/:reviewId',IsAuth2,ReviewController.deleteReview);

Router.get('/rating/:courseId',IsAuth2,ReviewController.Rating)

module.exports = Router;
