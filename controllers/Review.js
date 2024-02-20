const User = require('../models/User');
const Course = require('../models/Course');
const io = require('../socket_io');
const {validationResult} = require('express-validator');
const Review = require('../models/Review');
const { json } = require('body-parser');

exports.CReview = async(req,res,next)=>{
try{
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate('Reviews');
    if(!course){
        const error = new Error('Couldnt find Course');
        error.statusCode = 404;
        throw error;
    };
    const Reviewdata = {courseR:course.Reviews,Rating:course.Rating};
    res.status(200).json({
        message:'Reviews fetched',
        Reviewdata:Reviewdata
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

exports.AddingReview = async (req,res,next)=>{
try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error
    }
    const user = await User.findById(req.userId);
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate('Reviews');
    if(!course){
        const error = new Error('Couldnt find Course');
        error.statusCode = 404;
        throw error;
    };
    const equal = await Review.findOne({createdBy:req.userId,course:courseId});
    if(equal){
        const error = new Error('this User already gave Review.');
        error.statusCode = 409;
        throw error;
    }
    const review = new Review({
        rating:req.body.rating,
        comment:req.body.comment,
        createdBy:req.userId,
        course:courseId
    });
    const newreview = await review.save();
    course.Reviews.push(newreview);
    user.Reviews.push(newreview._id);
    await user.save();
    await course.save();
    io.getIO().broadcast('Reviews',json({
        message:'the new Review',
        review:newreview
    }))
    res.status(201).json({
        message:'review created',
        review:newreview
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

exports.editReview = async(req,res,next)=>{
try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error
    }
    const review = await Review.findById(req.params.reviewId);
    if(!review ){
        const error = new Error('Couldnt find Review.');
        error.statusCode = 404;
        throw error;
    }
    review.rating = req.body.rating;
    review.comment = req.body.comment;
    const newreview = await review.save();
    res.status(200).json({
        message:'Review has been Edited',
        review:newreview
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

exports.deleteReview = async (req,res,next)=>{
try{
    const user = await User.findById(req.userId);
    const review = await Review.findById(req.params.reviewId);
    const course = await Course.findById(req.params.courseId);
    if(!review || !course){
        const error = new Error('Couldnt find the Resources.');
        error.statusCode = 404;
        throw error;
    }
    if(review.createdBy !== user._id ){
        const error = new Error('Dont have the permission');
        error.statusCode = 403;
        throw error;
    }
    await Review.deleteOne({_id:review._id});
    course.Reviews.pull(review._id);
    await course.save();
    user.Reviews.pull(review._id);
    await user.save();
    res.status(204).send();
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}



exports.Rating = async (req,res,next)=>{
try{
    const course = await Course.findById(req.params.courseId).populate('Reviews');
    if(!course){
        const error = new Error('Couldnt find Course');
        error.statusCode = 404;
        throw error;
    };
    let TotalRating = 0;
    const TotalReviews = course.Reviews.length;
    course.Reviews.forEach(item=>{
        TotalRating = TotalRating + item.rating;
    })
    let Rating = 0;
    if(TotalReviews !==0){
        Rating = TotalRating/TotalReviews;
        Rating = Math.round(Rating * 100)/100;
    }
    res.status(200).json({
        message:'Fetched Rating',
        Rating:Rating
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}