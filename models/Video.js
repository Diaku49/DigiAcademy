const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VSchema = new Schema({
    name:{
        type:String,
        required:false
    },
    video:{
        type:String,
        required:true
    }
})

const VISchema = mongoose.model('Video',VSchema);
module.exports = VISchema;