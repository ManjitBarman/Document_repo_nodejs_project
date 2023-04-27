const express=require('express');
user_route= express();
const userController= require("../controllers/userControllers");
const bodyParser = require('body-parser');

//set template engine
user_route.set('view engine','ejs');
user_route.set('views', './views/users');

//body parser
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

//user route
user_route.get('/login',userController.loginLoad);
user_route.post('/login',userController.verifyLogin);
user_route.get('/dashboard',userController.getDashboard);




module.exports=user_route;