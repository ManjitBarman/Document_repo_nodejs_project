const express=require('express');
hod_route= express();
const hodController= require("../controllers/hodController");

const auth=require('../middleware/hodAuth');


//session
const session = require('express-session');
const config=require("../config/session");
hod_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
hod_route.set('view engine','ejs');
hod_route.set('views', './views/hod');

//body parser
const bodyParser = require('body-parser');
hod_route.use(bodyParser.json());
hod_route.use(bodyParser.urlencoded({extended:true}));

//admin route
hod_route.get('/hod_login',auth.isLogout,hodController.loginLoad);
hod_route.post('/hod_login',hodController.verifyLogin);
hod_route.get('/hod_profile',auth.isLogin,hodController.profile_Load);
hod_route.get('/hod_logout',auth.isLogin,hodController.adminLogout);
hod_route.get('/add_user',auth.isLogin,hodController.addUserLoad);



module.exports= hod_route;