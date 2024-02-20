const express = require('express');
require('dotenv').config();

//packages
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {IsAuth2} = require('./MiddleWare/isAuth');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20');
require('./MiddleWare/PassportConfig');


const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.acwxu0j.mongodb.net/${process.env.MONGO_DBNAME}`


//settings multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destPath = '';
        if (file.mimetype.startsWith('image/')) {
            destPath = '/images';
        } else if (file.mimetype.startsWith('video/')) {
            destPath = '/videos';
        }
        cb(null, path.join(__dirname, 'uploads', destPath));
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        cb(null, file.originalname.replace(ext, '') + '-' + Date.now() + ext);
    }
});
const fileFilter = (req,file,cb)=>{
    if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'||
    file.mimetype === 'video/mp4'
    ) {
    cb(null, true);
    } else {
    cb(null, false);
    }
};




const app = express();




const AuthRouter = require('./routes/auth'); 
const UserProfileRouter = require('./routes/UserProfile');
const CourseRouter = require('./routes/Course');
const EnrollRouter = require('./routes/Enroll');
const ReviewRouter = require('./routes/Review');
const AdminRouter = require('./routes/Admin');
const OAuth2Router = require('./routes/OAuth2');


//middlewares
app.use(compression({threshold:'2kb',}))
app.use(bodyParser.json());
app.use(helmet());
app.use(
    multer({ storage: storage, fileFilter: fileFilter }).fields([
        {name:'image',maxCount:1},
        {name:'videos',maxCount:200}
    ])
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(session({
//     secret:process.env.SessionKey,
//     resave:true,
//     saveUninitialized:true,
//     cookie:{
//         sameSite: "none",
//         maxAge:60*60*1000*24*7
//     }, //one week
// }))

// for Cors
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','https://play.google.com') // just an dummy server
    res.setHeader('Access-Control-Allow-Methods','PUT,GET,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers','Origin Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})
// cookie
app.use(cookieParser());
// passport
app.use(passport.initialize());

// app.get('/auth/github',
// passport.authenticate('github',{scope: ['profile','email'],session:false}))


// app.get('auth/github/callback',
// passport.authenticate('github',{ failureRedirect: '/login',session:false}),
//     (req, res)=>{
//     const { user, token } = req.user;

//     }
// );
// //callback of OAuth2
// app.get('/auth/google',
//     passport.authenticate("google",
//     { scope: ['profile','email'],session:false,accessType: 'offline', prompt: 'consent'}
//     ));

// app.get('/google/callback',
// passport.authenticate("google",{failureRedirect:"/login",session:false},),
//     (req,res)=>{
//         res.redirect('dummy ClientUrl');
//     }
// )

app.use('/auth',OAuth2Router);




app.get('/login', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Login with Google</title>
            </head>
            <body>
                <h1>Login with Google</h1>
                <a href="/auth/google">Login with Google</a>
                <a href="/auth/github">Login with GitHub</a>
            </body>
        </html>
    `);
});

app.get('/dummy',(req,res,next)=>{
    const user={
        id:req.user._id,
        role: req.user.role,
    }
    res.status(200).json({
        user:user
    })
})

// app.use('/authOP',AuthRouter);
app.use('/CRS',CourseRouter);
app.use('/Profile',UserProfileRouter);
app.use('/Enroll',EnrollRouter);
app.use('/Review',ReviewRouter);
app.use('/Admin',AdminRouter);



app.use((error,req,res,next)=>{
    console.log(error);
    const errorStatusCode = error.statusCode || 500;
    const errorData = error.data;
    const message = error.message;
    res.sendStatus(errorStatusCode).json({
        message:message,data:errorData
    })
})


mongoose.connect(MONGODB_URI)
.then(result=>{
    console.log('Connected to the Database');
    const server = app.listen(process.env.Port);
    console.log('Connected to the server');
    return  io = require('./socket_io').init(server);
})
.then(io=>{
    io.on('connection',(socket)=>{
        console.log('Client connect io.');
    })
})
.catch(err=>{
    console.log('Connecting to Database failed');
})
