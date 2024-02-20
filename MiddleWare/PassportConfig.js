const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');
const GitHubStrategy = require('passport-github');
const jwt = require('jsonwebtoken');





// GitHub OAuth2
exports.gitConfig = passport.use(new GitHubStrategy({
    clientID:process.env.GithubClientID,
    clientSecret:process.env.GithubClient_Secret,
    callbackURL:"http://localhost:3000/auth/github/callback"
},async(accessToken,refreshToken,profile,done)=>{
    try{
        const user = {id:profile.id,username:profile.username,accessToken:accessToken}
        const payload = {
            id:profile.id,
            username:profile.username
        }
        const token = jwt.sign(payload,process.env.SecretKey,{expiresIn:'1h'});
        //done
        done(null,{user,token});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        done(err,null);
    }
}))

// Google OAuth2
exports.GoogleConfig = passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientID,
    clientSecret:process.env.GoogleClient_Secret, 
    callbackURL:"http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},async (req,accessToken, refreshToken, profile,email, done) => {
    try {
        //mini user
        const user = {id:profile.id,username:profile.username,email:email,accessToken:accessToken}
        // payload
        const payload = {
            id:profile.id,
            username:profile.username
        }
        //token 
        const token = jwt.sign(payload,process.env.SecretKey,{expiresIn:'1h'});
        //done
        done(null, {user,token});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        done(err,null);
    }
}));