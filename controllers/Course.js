const Course = require('../models/Course');
const User = require('../models/User');
const {validationResult} = require('express-validator');
const path = require('path');
const io = require('../socket_io');
const Video = require('../models/Video');
const ClearFile = require('../util/ClearFile');


exports.getCourses = async (req,res,next)=>{
    try{
        const currentPage = req.query.page || 1;
        const perPage = 8;
        //counting the courses
        const totalCourses = await Course.find().countDocuments();
        //getting the Courses
        const Courses = await Course.find()
        .populate('Video')
        .populate('Reviews')
        .sort({createdAt:-1})
        .skip(perPage*(currentPage-1))
        .limit(perPage)
        // sending
        const totalPages = Math.ceil(totalCourses / perPage);
        res.status(200).json({
            message:'All Courses Fetched',
            Course: Courses,
            totalC:totalCourses,
            totalPages:totalPages
        })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.viewCourse = async (req,res,next)=>{
    try{
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId)
        .populate('Video')
        if(!course){
            const error = new Error('Couldnt find the Course.')
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({
            message:'Found Course',
            Course:course
        })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.CreateCourse = async (req,res,next)=>{
    try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    if(!req.files['videos'] || !req.files['image']){
        const error = new Error('Couldnt found file.');
        error.statusCode = 404;
        throw error;
    }
    // videos
    const videos = await Promise.all(req.files['videos'].map(async perV =>{
            const newVideo = new Video({ video: perV.path });
            return await newVideo.save();
    }));
    // image 
    const image = req.files['image'][0].path;
    const newCourse = new Course({
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        createdBy:req.userId,
        totalHour:req.body.totalHour,
        imageUrl:image,
        Video:videos
    });
    await newCourse.save();
    const user = await User.findById(req.userId);
    user.courseOwned.push(newCourse._id);
    await user.save();
    //informing other users
    io.getIO().broadcast.emit('Courses',json({action:'create',course:newCourse}))
    //sending response
    res.status(201).json({
        message:'Course Created.',
        course:newCourse
    })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.EditCourse = async (req,res,next)=>{
    try{
    const errors = validationResult(req);
    const courseId = req.params.courseId;
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    };
    //checking course
    const course = await Course.findById(courseId);
    if(!course){
        const error = new Error('Couldnt find Course.');
        error.statusCode = 404;
        throw error;
    }
    //checking user
    const user = await User.findById(req.userId);
    const OwnCourse = await user.courseOwned.find({_id:courseId})
    if(!OwnCourse){
        const error = new Error('You dont Own the Course');
        error.statusCode = 403;
        throw error;
    }
    //checking videos
    if(req.files['videos']){
        //creating new videos
        let DvideoPaths = [];
        // puting the videos
        let newVideos = await req.files['videos'].filter(item=>{
            const isEqual = course.Video.find(v =>{
                v.video === item.path
            });
            if(!isEqual){
                return true;
            }
            else{
                DvideoPaths.push(item.path);
                return false;
            }
        }).map(item=>new Video({video:item.path}))
        // deleting the selected paths
        if(DvideoPaths.length !== 0){
            ClearFile(DvideoPaths);
        }
        // puting new Videos array
        course.Video = newVideos;
    }
    // checking imaage
    if(req.files['image']){
        const image = req.files['image'].map(item=>{
            return item.path;
        });
        if(!course.imageUrl === ''){
            ClearFile(course.imageUrl);
        }
        course.imageUrl =  image[0];
    }
    // other properties
    course.title=req.body.title
    course.description=req.body.description
    course.price=req.body.price
    course.createdBy=req.userId
    course.totalHour=req.body.totalHour
    // saving course
    await course.save();
    //informing other users
    io.getIO().broadcast.emit('Courses',{action:'Edit',course:course})
    //sending response
    res.status(200).json({
        message:'Course Edited.',
        course:course
    })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.DeleteCourse = async (req,res,next)=>{
    const courseId = req.params.courseId;
    try{
        const course = await Course.findById(courseId).populate('Video');
        if(!course){
            const error = new Error('Couldnt find Course.');
            error.statusCode = 404;
            throw error;
        }
        const videoPaths = course.Video.map(item=>{
            return item.video;
        })
        ClearFile(videoPaths);
        ClearFile(course.imageUrl);
        const user = await User.findById(req.userId);
        user.courseOwned.pull(courseId);
        await user.save()
        await course.remove();
        res.status(204).send();
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.search = async(req,res,next)=>{
try{
    let Ckeyword = '';
    io.on('connection',socket=>{
        socket.emit('keyword',Ckeyword);
        socket.on('changeKeyword',keyword =>{
            Ckeyword = keyword;
        })
    });
    const currentPage = req.query.page || 1;
    const perPage = 8;
    //counting the courses
    const totalCourses = await Course.find({name:Ckeyword}).countDocuments();
    if(!totalCourses){
        const error = new Error('No Course Found.');
        error.statusCode = 404;
        throw error;
    }
    const Courses = await Course.find({name:Ckeyword})
    .populate('Video')
    .populate('Reviews')
    .sort({createdAt:-1})
    .skip(perPage*(currentPage-1))
    .limit(perPage)
    const totalPages = Math.ceil(totalCourses / perPage);
    res.status(200).json({
        message:'All Courses Fetched',
        Course: Courses,
        totalC:totalCourses,
        totalPages:totalPages
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}   


exports.filter = async(req,res,next)=>{
try{
    // queries
    const { minp, maxp, maxtotalH } = req.query;
    const query = {}
    if (minp && maxp) {
        query.price = { $gte: minp, $lte: maxp };
    } else if (minp) {
        query.price = { $gte: minp };
    } else if (maxp) {
        query.price = { $lte: maxp };
    }
    if(maxtotalH){
        query.totalHour = {$lte:maxtotalH}
    };
    // paging
    const currentPage = req.query.page || 1;
    const perPage = 8;
    //counting the courses
    const totalCourses = await Course.find(query).countDocuments();
    if(!totalCourses){
        const error = new Error('No Course Found.');
        error.statusCode = 404;
        throw error;
    }
    const totalPages = Math.ceil(totalCourses / perPage);
    //finding courses
    const Courses = await Course.find(query)
    .populate('Video')
    .populate('Reviews')
    .sort({createdAt:-1})
    .skip(perPage*(currentPage-1))
    .limit(perPage)
    //sending res
    res.status(200).json({
        message:'All Courses Fetched',
        Course: Courses,
        totalC:totalCourses,
        totalPages:totalPages
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

