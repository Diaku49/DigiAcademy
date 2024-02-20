const mongoose = require('mongoose');
const { blacklist } = require('validator');
const Schema = mongoose.Schema;

const BlacklistSchema = new Schema({
    token:{
        type:String,
        required:true
    }
})

const BlacklistToken = mongoose.model("BlacklistToken",BlacklistSchema);
module.exports = BlacklistToken;