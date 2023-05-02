const express=require('express');
admin_route= express();
const adminController= require("../controllers/adminControllers");

const auth=require('../middleware/adminAuth');


//session
const session = require('express-session');
const config=require("../config/session");
admin_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
admin_route.set('view engine','ejs');
admin_route.set('views', './views/admin');

//body parser
const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

//admin route
admin_route.get('/admin_login',auth.isLogout,adminController.loginLoad);
admin_route.post('/admin_login',adminController.verifyLogin);
admin_route.get('/admin_dashboard',auth.isLogin,adminController.profile_Load);
admin_route.get('/admin_logout',auth.isLogin,adminController.adminLogout);
admin_route.get('/add_user',auth.isLogin,adminController.addUserLoad);



module.exports= admin_route;