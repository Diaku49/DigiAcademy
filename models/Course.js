const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        reuired:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    ,
    totalHour:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    Reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review',
        required:false
    }],
    Rating:{
        type:Number,
        reuired:false
    },
    Video:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
        required:true
    }],
})

const Course = mongoose.model('Course',CourseSchema);
module.exports = Course;