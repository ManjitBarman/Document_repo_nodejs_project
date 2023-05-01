const express=require('express');
user_route= express();
const userController= require("../controllers/userControllers");

const auth=require('../middleware/auth');


//session
const session = require('express-session');
const config=require("../config/session");
user_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
user_route.set('view engine','ejs');
user_route.set('views', './views/users');

//body parser
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

//user route
user_route.get('/login',auth.isLogout,userController.loginLoad);
user_route.post('/login',userController.verifyLogin);
user_route.get('/dashboard',auth.isLogin,userController.getDashboard);
user_route.get('/logout',auth.isLogin,userController.userLogout);




module.exports= user_route;