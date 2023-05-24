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


//multer setting
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({

    destination:function (req,file,cb){
        cb(null,path.join(__dirname,'../public/uploadedFile'),function(error,success){
            if(error) throw error
        });

    },
    filename:function (req,file,cb){
        const name= Date.now() +'-'+ file.originalname;
        cb(null,name,function(error1,success1){
            if(error1) throw error1
        });
 
    }
});

const fileFilter = (req,file,cb)=>{
    (file.mimetype ==='application/msword'||file.mimetype ==='application/pdf'||file.mimetype ==='image/jpg'
    ||file.mimetype ==='image/jpeg')?cb(null ,true):cb(null,false)

};
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB file size limit
      },
})

// file validation 
const {docValidation} = require('../helper/validation')

//faculty route
faculty_route.get('/faculty_login',auth.isLogout,facultyController.loginLoad);
faculty_route.post('/faculty_login',facultyController.verifyLogin);
faculty_route.get('/faculty_profile',auth.isLogin,facultyController.getProfile);
faculty_route.get('/faculty_logout',auth.isLogin,facultyController.facultyLogout);
faculty_route.get('/faculty_upload',auth.isLogin,facultyController.uploadDocLoad);
faculty_route.post('/faculty_upload',upload.single('docname'),docValidation,facultyController.facultyUpload);
faculty_route.get('/faculty_search',auth.isLogin,facultyController.facultySearchLoad);





module.exports= faculty_route; 