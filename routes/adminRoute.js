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
admin_route.get('/add_one_user',auth.isLogin,adminController.addOneUserLoad);
admin_route.post('/add_one_user',adminController.addUser);
admin_route.get('/verify',adminController.verifyMail);
admin_route.get('/show_user_list',auth.isLogin,adminController.userListLoad);
admin_route.get('/edit_user',auth.isLogin,adminController.editUserLoad);
admin_route.get('/add_category',auth.isLogin,adminController.CategoryLoad);
admin_route.post('/add_category',adminController.addCategory);
admin_route.get('/add_folder',auth.isLogin,adminController.folderLoad);
admin_route.post('/add_folder',adminController.addFolder); 



admin_route.get('*',function(req,resp){
    resp.redirect('admin_login');
});




module.exports= admin_route;