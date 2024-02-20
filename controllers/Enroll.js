const User = require('../models/User');
const Course = require('../models/Course');
const io = require('../socket_io');




exports.userEnrolls = async (req,res,next)=>{
try{
    const user = await User.findById(req.userId).populate('courseEnrolled');
    if(!user){
        const error = new Error('Couldnt find User');
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({
        message:'Fetched the Enroll Courses',
        Ecourses:user.courseEnrolled
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

exports.Enroll = async(req,res,next)=>{
try{
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if(!course){
        const error = new Error('Couldnt find Course.');
        error.statusCode = 404;
        throw error;
    };
    // enroll user
    const user = await User.findById(req.userId);
    user.courseEnrolled.push(courseId);
    await user.save()
    //send enroll course
    res.status(200).json({
        message:'Purchase completed, User got Enrolled.',
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


exports.Unroll = async (req,res,next)=>{
    try{
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if(!course){
        const error = new Error('Couldnt find Course.');
        error.statusCode = 404;
        throw error;
    };
    //check the course
    const user = await User.findById(req.userId);
    const CourseIndex = user.courseEnrolled.findIndex(courseId);
    if(CourseIndex === -1){
        const error = new Error('This Course wasnt Enrolled by the User.');
        error.statusCode = 404;
        throw error;
    }
    // user unroll
    user.courseEnrolled.splice(CourseIndex,1);
    await user.save();
    //send the unroll
    res.status(200).json({
        message:'Course got Unrolled',
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