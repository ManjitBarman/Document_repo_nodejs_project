const express=require('express');
staff_route= express();
const staffController= require("../controllers/staffController");

const auth=require('../middleware/staffAuth');


//session
const session = require('express-session');
const config=require("../config/session");
staff_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
staff_route.set('view engine','ejs');
staff_route.set('views', './views/staff');

//body parser
const bodyParser = require('body-parser');
staff_route.use(bodyParser.json());
staff_route.use(bodyParser.urlencoded({extended:true}));

//admin route
staff_route.get('/staff_login',auth.isLogout,staffController.loginLoad);
staff_route.post('/staff_login',staffController.verifyLogin);
staff_route.get('/staff_profile',auth.isLogin,staffController.getProfile);
staff_route.get('/staff_logout',auth.isLogin,staffController.staffLogout);




module.exports= staff_route;