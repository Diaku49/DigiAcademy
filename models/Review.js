const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    rating:{
        type:Number,
        required:true,
        min:1,
        max:100
    },
    comment:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:'Course',
        required:true
    }
});

const reviewmodel = mongoose.model('Review',ReviewSchema);
module.exports = reviewmodel;