const express = require('express');

const ReviewController = require('../controllers/Review');
const {body} = require('express-validator');



const Router = express.Router();

Router.get('/reviews/:courseId',ReviewController.CReview);

Router.post('/add/review/:courseId',[
    body('rating')
    .isInt({min:1,max:100})
    .withMessage('not a number'),
    body('comment')
    .isLength({min:7})
    .withMessage('not Enough Characters.')
],ReviewController.AddingReview);

Router.put('/edit/review/:reviewId',[
    body('rating')
    .isInt({min:1,max:100})
    .withMessage('not a number'),
    body('comment')
    .isLength({min:7})
    .withMessage('not Enough Characters.')
],ReviewController.editReview);

Router.delete('/delete/:courseId/:reviewId',ReviewController.deleteReview);

Router.get('/rating/:courseId',ReviewController.Rating)

module.exports = Router;
