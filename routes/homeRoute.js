const express = require('express');
const home_route= express();
// const path = require('path')
const homeController= require("../controllers/homeController");


//set template engine
home_route.set('view engine','ejs');
home_route.set('views', './views')

//static files
// home_route.use('/static', express.static(path.join(__dirname, 'public')))
// home_route.use("/student/edit",express.static(join(process.cwd(),"public")))

//
home_route.get('/',homeController.getHomePage);



module.exports= home_route;