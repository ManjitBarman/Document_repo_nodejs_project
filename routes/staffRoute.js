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
const {docValidation} = require('../helper/validation');

//admin route
staff_route.get('/staff_login',auth.isLogout,staffController.loginLoad);
staff_route.post('/staff_login',staffController.verifyLogin);
staff_route.get('/staff_profile',auth.isLogin,staffController.getProfile);
staff_route.get('/staff_logout',auth.isLogin,staffController.staffLogout);
staff_route.get('/staff_upload',auth.isLogin,staffController.uploadDocLoad);
staff_route.get('/get_folders/:categoryId',auth.isLogin,staffController.getFoldersByCategory)
staff_route.post('/staff_upload',upload.single('docname'),docValidation,staffController.staffUpload);
staff_route.get('/staff_search',auth.isLogin,staffController.staffSearchLoad);
staff_route.post('/search_by_docno',auth.isLogin,staffController.searchByDocumentNo);
staff_route.post('/search_by_keyword',auth.isLogin,staffController.searchByKeyword);
staff_route.post('/search_by_filename',auth.isLogin,staffController.searchByFilename);
staff_route.get('/staff_view',auth.isLogin,staffController.staffViewLoad);
staff_route.post('/staff_view',auth.isLogin,staffController.staffView);



module.exports= staff_route;