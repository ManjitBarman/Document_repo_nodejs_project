const express=require('express');
faculty_route= express();
const facultyController= require("../controllers/facultyController");

const auth=require('../middleware/facultyAuth');


//session
const session = require('express-session');
const config=require("../config/session");
faculty_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
faculty_route.set('view engine','ejs');
faculty_route.set('views', './views/Faculty');

//body parser
const bodyParser = require('body-parser');
faculty_route.use(bodyParser.json());
faculty_route.use(bodyParser.urlencoded({extended:true}));

//faculty route
faculty_route.get('/faculty_login',auth.isLogout,facultyController.loginLoad);
faculty_route.post('/faculty_login',facultyController.verifyLogin);
faculty_route.get('/faculty_profile',auth.isLogin,facultyController.getProfile);
faculty_route.get('/faculty_logout',auth.isLogin,facultyController.facultyLogout);




module.exports= faculty_route;