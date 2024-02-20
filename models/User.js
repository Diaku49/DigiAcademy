const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    S_id:{
        googleid:{
            type:String,
            required:false
        },
        gitHubid:{
            type:String,
            required:false
        }
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    role:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:false
    },
    courseOwned:[{
        type:Schema.Types.ObjectId,
        ref:'Course',
        required:false
    }],
    courseEnrolled:[{
        type:Schema.Types.ObjectId,
        ref:'Course',
        required:false
    }],
    Reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
        required:false
    }],
    accessToken:{
        type:String,
        required:false
    }
},{timestamps:true})


UserSchema.methods.changeRole = function(role){
    this.role = role;
    return this.save().catch(err=>{
        const error = new Error('failed to change the Role.');
        error.statusCode = 409;
        throw error;
    })
}


const User = mongoose.model('User',UserSchema);
module.exports = User;